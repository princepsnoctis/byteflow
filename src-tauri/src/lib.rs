// Importy niezbędnych bibliotek
use serialport::{DataBits, Parity, SerialPort, StopBits};
use std::{
    fs::File,
    io::{Read, Write},
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
    thread,
};
use tauri::{self, Emitter};

/// Struktura przechowująca konfigurację portu szeregowego
#[derive(Clone, Copy)]
struct Config {
    baud_rate: u32,      // Prędkość transmisji
    data_bits: DataBits, // Liczba bitów danych
    stop_bits: StopBits, // Liczba bitów stopu
    parity: Parity,      // Rodzaj parzystości
}

/// Struktura przechowująca stan aplikacji
struct AppState {
    config: Mutex<Config>,  // Konfiguracja portu
    port: Arc<Mutex<Option<Box<dyn SerialPort + Send>>>>, // Port szeregowy
    running: Arc<AtomicBool>, // Flaga czy port jest aktywny
    log_file: Arc<Mutex<Option<File>>>, // Plik logu
    logging_enabled: Arc<AtomicBool>, // Flaga czy logowanie jest włączone 
    log_path: Arc<Mutex<Option<String>>>, // Ścieżka do pliku logu
}

/// Połączenie z portem szeregowym
#[tauri::command]
fn connect(path: &str, app_state: tauri::State<AppState>) -> Result<(), String> {
    // Pobierz konfigurację i dostęp do portu
    let config = app_state.config.lock().map_err(|_| "Failed to access config")?;
    let mut port_guard = app_state.port.lock().map_err(|_| "Failed to access port")?;

    // Jeśli port jest już otwarty - zamknij go
    if port_guard.is_some() {
        *port_guard = None;
    }

    // Otwórz nowe połączenie z zadanymi parametrami
    let port = serialport::new(path, config.baud_rate)
        .data_bits(config.data_bits)
        .stop_bits(config.stop_bits)
        .parity(config.parity)
        .open()
        .map_err(|e| format!("Failed to open port {}: {}", path, e))?;

    *port_guard = Some(port);
    Ok(())
}

/// Rozłączenie z portem szeregowym 
#[tauri::command]
fn disconnect(app_state: tauri::State<AppState>) -> Result<(), String> {
    app_state.running.store(false, Ordering::SeqCst);
    let mut port_guard = app_state.port.lock().map_err(|_| "Failed to access port")?;
    *port_guard = None;
    Ok(())
}

/// Pobranie listy dostępnych portów
#[tauri::command]
fn get_available_ports(app_state: tauri::State<AppState>) -> Result<Vec<String>, String> {
    let mut port_guard = app_state.port.lock().map_err(|_| "Failed to access port")?;
    *port_guard = None;

    // Pobierz listę portów i przekształć na wektor nazw
    let ports = serialport::available_ports()
        .map_err(|e| format!("Failed to list ports: {}", e))?
        .iter()
        .map(|p| p.port_name.clone())
        .collect();

    Ok(ports)
}

/// Ustawienie prędkości transmisji
#[tauri::command]
fn set_baud_rate(baud_rate: u32, app_state: tauri::State<AppState>) -> Result<(), String> {
    // Zaktualizuj konfigurację
    let mut config = app_state.config.lock().map_err(|_| "Failed to access config")?;
    config.baud_rate = baud_rate;

    // Jeśli port jest otwarty - zaktualizuj jego parametry
    let mut port_guard = app_state.port.lock().map_err(|_| "Failed to access port")?;
    if let Some(port) = port_guard.as_mut() {
        port.set_baud_rate(baud_rate)
            .map_err(|e| format!("Error setting baud rate: {}", e))?;
    }

    Ok(())
}

/// Ustawienie liczby bitów danych
#[tauri::command]
fn set_data_bits(data_bits: &str, app_state: tauri::State<AppState>) -> Result<(), String> {
    // Przekształć string na enum DataBits
    let bits = match data_bits {
        "5" => DataBits::Five,
        "6" => DataBits::Six,
        "7" => DataBits::Seven,
        "8" => DataBits::Eight,
        _ => DataBits::Eight,
    };

    // Zaktualizuj konfigurację
    let mut config = app_state.config.lock().map_err(|_| "Failed to access config")?;
    config.data_bits = bits;

    // Jeśli port otwarty - zaktualizuj parametry
    let mut port_guard = app_state.port.lock().map_err(|_| "Failed to access port")?;
    if let Some(port) = port_guard.as_mut() {
        port.set_data_bits(bits)
            .map_err(|e| format!("Error setting data bits: {}", e))?;
    }

    Ok(())
}

/// Ustawienie liczby bitów stopu
#[tauri::command]
fn set_stop_bits(stop_bits: &str, app_state: tauri::State<AppState>) -> Result<(), String> {
    // Przekształć string na enum StopBits
    let bits = match stop_bits {
        "1" => StopBits::One,
        "2" => StopBits::Two,
        _ => StopBits::One,
    };

    // Zaktualizuj konfigurację
    let mut config = app_state.config.lock().map_err(|_| "Failed to access config")?;
    config.stop_bits = bits;

    // Jeśli port otwarty - zaktualizuj parametry
    let mut port_guard = app_state.port.lock().map_err(|_| "Failed to access port")?;
    if let Some(port) = port_guard.as_mut() {
        port.set_stop_bits(bits)
            .map_err(|e| format!("Error setting stop bits: {}", e))?;
    }

    Ok(())
}

/// Ustawienie parzystości
#[tauri::command]
fn set_parity(parity: &str, app_state: tauri::State<AppState>) -> Result<(), String> {
    // Przekształć string na enum Parity
    let mode = match parity {
        "None" => Parity::None,
        "Odd" => Parity::Odd,
        "Even" => Parity::Even,
        _ => Parity::None,
    };

    // Zaktualizuj konfigurację
    let mut config = app_state.config.lock().map_err(|_| "Failed to access config")?;
    config.parity = mode;

    // Jeśli port otwarty - zaktualizuj parametry
    let mut port_guard = app_state.port.lock().map_err(|_| "Failed to access port")?;
    if let Some(port) = port_guard.as_mut() {
        port.set_parity(mode)
            .map_err(|e| format!("Error setting parity: {}", e))?;
    }

    Ok(())
}

/// Rozpoczęcie logowania do pliku
#[tauri::command]
fn start_logging(file_path: String, app_state: tauri::State<AppState>) -> Result<(), String> {
    // Utwórz plik logu
    let file = File::create(&file_path).map_err(|e| format!("Cannot create log file: {}", e))?;
    let mut path_guard = app_state.log_path.lock().map_err(|_| "Log path lock failed")?;
    *path_guard = Some(file_path.clone());

    // Ustaw plik i włącz logowanie
    let mut file_guard = app_state.log_file.lock().map_err(|_| "Log file lock failed")?;
    *file_guard = Some(file);
    app_state.logging_enabled.store(true, Ordering::SeqCst);

    Ok(())
}

/// Zatrzymanie logowania
#[tauri::command]
fn stop_logging(app_state: tauri::State<AppState>) -> Result<(), String> {
    let mut file_guard = app_state.log_file.lock().map_err(|_| "Log file lock failed")?;
    *file_guard = None;
    app_state.logging_enabled.store(false, Ordering::SeqCst);
    Ok(())
}

/// Sprawdzenie czy logowanie jest włączone
#[tauri::command]
fn is_logging_enabled(app_state: tauri::State<AppState>) -> Result<bool, String> {
    Ok(app_state.logging_enabled.load(Ordering::SeqCst))
}

/// Pobranie ścieżki aktualnego pliku logu
#[tauri::command]
fn get_current_log_path(app_state: tauri::State<AppState>) -> Result<Option<String>, String> {
    let path_guard = app_state.log_path.lock().map_err(|_| "Log path lock failed")?;
    Ok(path_guard.clone())
}

/// Wysłanie danych przez port szeregowy
#[tauri::command]
fn send(message: String, app_state: tauri::State<AppState>) -> Result<usize, String> {
    let mut port_guard = app_state.port.lock().map_err(|_| "Failed to access port")?;

    if let Some(ref mut port) = *port_guard {
        // Obsługa wiadomości zaczynającej się od $$
        if message.starts_with("$$") {
            let clean_message = message[1..].to_string();
            let bytes_written = port
                .write(clean_message.as_bytes())
                .map_err(|e| format!("Failed to send escaped $ message: {}", e))?;

            port.flush()
                .map_err(|e| format!("Failed to flush port buffer: {}", e))?;

            Ok(bytes_written)
        }
        // Obsługa wiadomości hex zaczynającej się od $
        else if message.starts_with('$') {
            let raw = &message[1..];
            // Obsługa różnych zakończeń linii
            let (hex_part, newline_bytes): (&str, Option<&[u8]>) = if raw.ends_with("\r\n") {
                (&raw[..raw.len() - 2], Some(b"\r\n"))
            } else if raw.ends_with("\n\r") {
                (&raw[..raw.len() - 2], Some(b"\n\r"))
            } else if raw.ends_with('\n') {
                (&raw[..raw.len() - 1], Some(b"\n"))
            } else if raw.ends_with('\r') {
                (&raw[..raw.len() - 1], Some(b"\r"))
            } else {
                (raw, None)
            };

            // Przygotowanie danych hex
            let trimmed_message = hex_part.trim().replace(" ", "");
            if trimmed_message.len() % 2 != 0 {
                return Err("Hex string has an odd number of digits".to_string());
            }

            let mut bytes = hex::decode(&trimmed_message)
                .map_err(|e| format!("Failed to decode hex: {}", e))?;

            // Dodaj znaki końca linii jeśli były
            if let Some(newline) = newline_bytes {
                bytes.extend_from_slice(newline);
            }

            // Wyślij dane
            let bytes_written = port
                .write(&bytes)
                .map_err(|e| format!("Failed to send hex message: {}", e))?;

            port.flush()
                .map_err(|e| format!("Failed to flush port buffer: {}", e))?;

            Ok(bytes_written)
        }
        // Wysłanie zwykłej wiadomości tekstowej 
        else {
            let bytes_written = port
                .write(message.as_bytes())
                .map_err(|e| format!("Failed to send message: {}", e))?;

            port.flush()
                .map_err(|e| format!("Failed to flush port buffer: {}", e))?;

            Ok(bytes_written)
        }
    } else {
        Err("No serial port connected".to_string())
    }
}

/// Odczyt danych z portu szeregowego
#[tauri::command]
fn read(app_state: tauri::State<AppState>, window: tauri::Window) {
    // Sprawdź czy wątek nie jest już uruchomiony
    if app_state.running.load(Ordering::SeqCst) {
        return;
    }

    app_state.running.store(true, Ordering::SeqCst);

    // Przygotuj współdzielone zmienne dla wątku
    let port_arc = Arc::clone(&app_state.port);
    let running = Arc::clone(&app_state.running);
    let log_file = Arc::clone(&app_state.log_file);
    let logging_enabled = Arc::clone(&app_state.logging_enabled);

    // Uruchom wątek odczytu
    thread::spawn(move || {
        let mut line_buffer = String::new();

        while running.load(Ordering::SeqCst) {
            let mut buffer = [0u8; 128];
            let mut guard = match port_arc.lock() {
                Ok(g) => g,
                Err(e) => {
                    eprintln!("Port lock error: {}", e);
                    continue;
                }
            };

            // Jeśli port jest otwarty
            if let Some(ref mut port) = *guard {
                match port.read(&mut buffer) {
                    Ok(n) if n > 0 => {
                        let chunk = String::from_utf8_lossy(&buffer[..n]);

                        // Przetwarzaj dane znak po znaku
                        for c in chunk.chars() {
                            if c == '\n' || c == '\r' {
                                if !line_buffer.trim().is_empty() {
                                    // Przygotuj różne formaty danych
                                    let utf8 = line_buffer.clone();
                                    let ascii = utf8.chars().filter(|c| c.is_ascii()).collect::<String>();
                                    let hex = utf8
                                        .as_bytes()
                                        .iter()
                                        .map(|b| format!("{:02X}", b))
                                        .collect::<Vec<_>>()
                                        .join(" ");

                                    // Wyślij dane do interfejsu
                                    let _ = window.emit(
                                        "serial-data",
                                        serde_json::json!({
                                            "data": {
                                                "utf8": utf8,
                                                "ascii": ascii,
                                                "hex": hex
                                            },
                                            "bytes": n
                                        }),
                                    );

                                    // Zapisz do pliku logu jeśli włączone
                                    if logging_enabled.load(Ordering::SeqCst) {
                                        if let Ok(mut log) = log_file.lock() {
                                            if let Some(ref mut file) = *log {
                                                let _ = writeln!(file, "{}", utf8);
                                            }
                                        }
                                    }
                                }
                                line_buffer.clear();
                            } else {
                                line_buffer.push(c);
                            }
                        }
                    }
                    Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => {}
                    Err(e) => eprintln!("Read error: {}", e),
                    _ => (),
                }
            }

            drop(guard);
            thread::sleep(std::time::Duration::from_millis(10));
        }
    });
}

/// Główna funkcja uruchamiająca aplikację
pub fn run() {
    // Inicjalizacja stanu aplikacji
    let app_state = AppState {
        config: Mutex::new(Config {
            baud_rate: 9600,
            data_bits: DataBits::Eight,
            stop_bits: StopBits::One,
            parity: Parity::None,
        }),
        port: Arc::new(Mutex::new(None)),
        running: Arc::new(AtomicBool::new(false)),
        log_file: Arc::new(Mutex::new(None)),
        logging_enabled: Arc::new(AtomicBool::new(false)),
        log_path: Arc::new(Mutex::new(None)),
    };

    // Konfiguracja i uruchomienie aplikacji Tauri
    tauri::Builder::default()
        .manage(app_state)
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            connect,
            disconnect, 
            get_available_ports,
            set_baud_rate,
            set_data_bits,
            set_stop_bits,
            set_parity,
            read,
            start_logging,
            stop_logging,
            is_logging_enabled,
            get_current_log_path,
            send
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}