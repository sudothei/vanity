use actix_cors::Cors;
use actix_web::{http, web, App, HttpServer};
use mongodb::{options::ClientOptions, Client};
use std::env;
use std::sync::*;

mod asset;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // environment variables
    let hostname: String = env::var("SERVER_HOSTNAME").expect("SERVER_HOSTNAME must be set");
    let database_username: String =
        env::var("DATABASE_USERNAME").expect("DATABASE_USERNAME must be set");
    let database_password: String =
        env::var("DATABASE_PASSWORD").expect("DATABASE_PASSWORD must be set");

    // database config
    let mut client_options = ClientOptions::parse(format!(
        "mongodb://{}:{}@localhost:27017",
        database_username, database_password
    ))
    .await
    .unwrap();
    client_options.app_name = Some("sudothei".to_string());
    let db = web::Data::new(Mutex::new(
        Client::with_options(client_options)
            .unwrap()
            .database("sudothei"),
    ));

    // uses move to avoid closure problems with db
    HttpServer::new(move || {
        // uses cors to allow api requests from frontend, cloned hostname to avoid closure issues
        let cors = Cors::default()
            .allowed_origin(format!("https://{}/", hostname.clone()).as_str())
            .allow_any_method()
            .allowed_headers(vec![
                http::header::AUTHORIZATION,
                http::header::ACCEPT,
                http::header::CONTENT_TYPE,
            ])
            .max_age(3600);
        App::new()
            .app_data(db.clone())
            .wrap(cors)
            .service(asset::list)
            .service(asset::create)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
