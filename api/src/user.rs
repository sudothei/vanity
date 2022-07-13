use actix_web::web::Json;
use actix_web::{get, post, web, HttpResponse, Responder};
use mongodb::{bson::doc, Database};
use serde::{Deserialize, Serialize};
use std::sync::*;
use tokio_stream::StreamExt;

/// list all users `/assets`
#[get("/assets")]
pub async fn list(data: web::Data<Mutex<Database>>) -> impl Responder {
    let db = data.lock().unwrap();
    let asset_collection = db.collection::<Asset>("assets");
    let cursor = asset_collection.find(None, None).await.unwrap();

    let results: Vec<Result<Asset, mongodb::error::Error>> = cursor.collect().await;
    let assets: Vec<Asset> = results.into_iter().map(|d| d.unwrap()).collect();

    HttpResponse::Ok()
        .content_type("application/json")
        .json(assets)
}

/// create a asset `/assets`
#[post("/assets")]
pub async fn create(asset_req: Json<AssetRequest>) -> HttpResponse {
    HttpResponse::Created()
        .content_type("application/json")
        .json(asset_req)
}
