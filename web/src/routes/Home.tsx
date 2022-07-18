import * as React from "react";
import { SicpWizard } from "components/SicpWizard";
import { SocialButtons } from "components/SocialButtons";
import { Terminal } from "components/Terminal";
import { AnimatedPfp } from "components/AnimatedPfp";

export const Home = () => {
  return (
    <div className="container">
      <SicpWizard />
      <Terminal />

      <div className="ui-box">
        <AnimatedPfp />
      </div>

      <div className="ui-box">
        <SocialButtons />
      </div>
    </div>
  );
};
