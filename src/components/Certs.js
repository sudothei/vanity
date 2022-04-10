import React from "react";
import APlus from "../static/images/comptiaaplus.webp";
import NetworkPlus from "../static/images/comptianetplus.webp";
import SecurityPlus from "../static/images/comptiasecplus.webp";
import DataPlus from "../static/images/comptiadataplus.webp";

export const Cert = (props) => {
  const width = window.innerWidth < 700 ? 100 : 200;
  const height = window.innerWidth < 700 ? 92.5 : 185;
  return (
    <a href={props.url} className="cert" target="blank">
      <img
        src={props.src}
        alt={props.alt}
        width={width}
        height={height}
        style={{ padding: "1em" }}
      />
    </a>
  );
};
export const Certs = () => {
  return (
    <div
      className="ui-box"
      style={{
        display: "flex",
        flexFlow: "wrap",
        justifyContent: "space-evenly",
      }}
    >
      <Cert
        src={APlus}
        alt="A+ Certified"
        url="https://www.certmetrics.com/comptia/public/verification.aspx?code=Z24P4RGELL4EYSPW"
      />
      <Cert
        src={NetworkPlus}
        alt="Network+ Certified"
        url="https://www.certmetrics.com/comptia/public/verification.aspx?code=K0RBY7XFHDEEQQGL"
      />
      <Cert
        src={SecurityPlus}
        alt="Security+ Certified"
        url="https://www.certmetrics.com/comptia/public/verification.aspx?code=XQKBHXHG6K4417WG"
      />
      <Cert
        src={DataPlus}
        alt="Data+ Certified"
        url="https://www.credly.com/badges/3870321e-0251-4bf1-a353-6c53d267c855/public_url"
      />
    </div>
  );
};
