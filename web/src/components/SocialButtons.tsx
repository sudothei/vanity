import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTwitter,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

library.add(faTwitter, faLinkedin, faGithub);

export const SocialButtons = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="ui-box" style={{ width: "auto" }}>
        <a
          href="http://twitter.com/sudothei"
          target="blank"
          style={{ padding: "0.5em" }}
        >
          <FontAwesomeIcon icon={faTwitter} size="lg" /> Twitter
        </a>
      </div>
      <div className="ui-box" style={{ width: "auto" }}>
        <a
          href="http://linkedin.com/in/paigevenuto"
          target="blank"
          style={{ padding: "0.5em" }}
        >
          <FontAwesomeIcon icon={faLinkedin} size="lg" /> LinkedIn
        </a>
      </div>
      <div className="ui-box" style={{ width: "auto" }}>
        <a
          href="http://github.com/sudothei"
          target="blank"
          style={{ padding: "0.5em" }}
        >
          <FontAwesomeIcon icon={faGithub} size="lg" /> GitHub
        </a>
      </div>
    </div>
  );
};
