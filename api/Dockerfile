FROM rust:latest as build
RUN USER=root cargo new --bin api
WORKDIR /api
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./config.toml /.cargo/config.toml
RUN cargo build --release

RUN rm src/*.rs
COPY ./src ./src
RUN rm ./target/release/deps/api*
RUN cargo build --release

FROM debian:buster-slim
COPY --from=build /api/target/release/api .
CMD ["./api"]
USER api
