import TerminalInReact from "terminal-in-react";
import React from "react";
import axios from "axios";
import { useState } from "react";

export const Terminal = () => {
  const titleArt =
    window.innerWidth < 700
      ? "Welcome to SudoThei"
      : `
  ██████  █    ██ ▓█████▄  ▒█████  ▄▄▄█████▓ ██░ ██ ▓█████  ██▓
▒██    ▒  ██  ▓██▒▒██▀ ██▌▒██▒  ██▒▓  ██▒ ▓▒▓██░ ██▒▓█   ▀ ▓██▒
░ ▓██▄   ▓██  ▒██░░██   █▌▒██░  ██▒▒ ▓██░ ▒░▒██▀▀██░▒███   ▒██▒
  ▒   ██▒▓▓█  ░██░░▓█▄   ▌▒██   ██░░ ▓██▓ ░ ░▓█ ░██ ▒▓█  ▄ ░██░
▒██████▒▒▒▒█████▓ ░▒████▓ ░ ████▓▒░  ▒██▒ ░ ░▓█▒░██▓░▒████▒░██░
▒ ▒▓▒ ▒ ░░▒▓▒ ▒ ▒  ▒▒▓  ▒ ░ ▒░▒░▒░   ▒ ░░    ▒ ░░▒░▒░░ ▒░ ░░▓  
░ ░▒  ░ ░░░▒░ ░ ░  ░ ▒  ▒   ░ ▒ ▒░     ░     ▒ ░▒░ ░ ░ ░  ░ ▒ ░
░  ░  ░   ░░░ ░ ░  ░ ░  ░ ░ ░ ░ ▒    ░       ░  ░░ ░   ░    ▒ ░
      ░     ░        ░        ░ ░            ░  ░  ░   ░  ░ ░  
┌─┐  ┌┬┐┌─┐─┐ ┬┌┬┐  ┌─┐┌┬┐┬  ┬┌─┐┌┐┌┌┬┐┬ ┬┬─┐┌─┐  ┌─┐┌─┐┌┬┐┌─┐ 
├─┤   │ ├┤ ┌┴┬┘ │   ├─┤ ││└┐┌┘├┤ │││ │ │ │├┬┘├┤   │ ┬├─┤│││├┤  
┴ ┴   ┴ └─┘┴ └─ ┴   ┴ ┴─┴┘ └┘ └─┘┘└┘ ┴ └─┘┴└─└─┘  └─┘┴ ┴┴ ┴└─┘o
`;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="ui-box"
      style={{
        display: "flex",
        width: "100%",
        height: "32em",
        overflow: "scroll",
      }}
    >
      <TerminalInReact
        msg={titleArt}
        hideTopBar={true}
        allowTabs={false}
        color="#00ff00"
        prompt="#00ff00"
        height={"32em"}
        width="100%"
        startState="maximised"
        promptSymbol={"guest@sudothei: "}
        backgroundColor={"transparent"}
        style={{ fontSize: "1em" }}
        commands={{
          register: (args, print) => {
            const user = args.slice(1, 2).join(" ");
            const password = args.slice(2).join(" ");
            axios
              .post("http://localhost:3333/register", {
                username: user,
                password: password,
              })
              .then((response) => {
                print(response.data);
                setUsername(user);
                setPassword(password);
              });
          },
          login: (args, print) => {
            const user = args.slice(1, 2).join(" ");
            const password = args.slice(2).join(" ");
            axios
              .post("http://localhost:3333/login", {
                username: user,
                password: password,
              })
              .then((response) => {
                print(response.data);
                if (response.data === "LOGGED IN :" + user) {
                  setUsername(user);
                  setPassword(password);
                }
              });
          },
          "start game": (print) => {
            axios
              .post("http://sudothei:3333/game", {
                command: "start game",
                username: username,
                password: password,
              })
              .then((response) => {
                print(response.data);
              });
          },
        }}
        commandPassThrough={(cmd, print) => {
          axios
            .post("http://sudothei:3333/game", {
              command: cmd.join(" "),
              username: username,
              password: password,
            })
            .then((response) => {
              print(response.data);
            });
        }}
        descriptions={{
          register: "USAGE: register <username> <password>",
          login: "USAGE: login <username> <password>",
          "start game": "starts the game",
        }}
      />
    </div>
  );
};
