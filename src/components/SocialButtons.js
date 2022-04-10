import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTwitter,
  faLinkedin,
  faGithub,
  faGitlab,
} from "@fortawesome/free-brands-svg-icons";

library.add(faTwitter, faLinkedin, faGithub, faGitlab);

export const SocialButtons = (props) => {
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
          <FontAwesomeIcon icon="fa-brands fa-twitter" size="lg" /> Twitter
        </a>
      </div>
      <div className="ui-box" style={{ width: "auto" }}>
        <a
          href="http://linkedin.com/in/paigevenuto"
          target="blank"
          style={{ padding: "0.5em" }}
        >
          <FontAwesomeIcon icon="fa-brands fa-linkedin" size="lg" /> LinkedIn
        </a>
      </div>
      <div className="ui-box" style={{ width: "auto" }}>
        <a
          href="http://github.com/sudothei"
          target="blank"
          style={{ padding: "0.5em" }}
        >
          <FontAwesomeIcon icon="fa-brands fa-github" size="lg" /> GitHub
        </a>
      </div>
      <div className="ui-box" style={{ width: "auto" }}>
        <a
          href="http://gitlab.com/sudothei"
          target="blank"
          style={{ padding: "0.5em" }}
        >
          <FontAwesomeIcon icon="fa-brands fa-gitlab" size="lg" /> GitLab
        </a>
      </div>
    </div>
  );
};
