/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext } from "@ST/scripts/extensions.js";
import Settings from "./Settings";
import { createRoot } from "react-dom/client";
import React from "react";
import "./styles/main.scss";

// declare var SillyTavern: any;
export const globalContext = getContext();

function createSlashCommands() {
  const SlashCommandParser = globalContext.SlashCommandParser;
  const SlashCommand = globalContext.SlashCommand;
  const SlashCommandNamedArgument = globalContext.SlashCommandNamedArgument;
  const SlashCommandArgument = globalContext.SlashCommandArgument;
  const ARGUMENT_TYPE = globalContext.ARGUMENT_TYPE;

  SlashCommandParser.addCommandObject(
    SlashCommand.fromProps({
      name: "music-box-command",
      callback: (namedArgs: any, unnamedArgs: any) => {
        return Array(namedArgs.times ?? 5)
          .fill(unnamedArgs.toString())
          .join(" ");
      },
      aliases: ["example-hack-command"],
      returns: "the repeated text",
      namedArgumentList: [
        SlashCommandNamedArgument.fromProps({
          name: "times",
          description: "number of times to repeat the text",
          typeLisst: ARGUMENT_TYPE.NUMBER,
          defaultValue: "5"
        })
      ],
      unnamedArgumentList: [
        SlashCommandArgument.fromProps({
          description: "the text to repeat",
          typeList: ARGUMENT_TYPE.STRING,
          isRequired: true
        })
      ],
      helpSString: `
                    <div>
                        Repeats the provided text a number of times.
                    </div>
                    <div>
                        <strong>Example:</strong>
                        <ul>
                            <li>
                                <pre><code class="language-stscript">/repeat foo</code></pre>
                                returns "foofoofoofoofoo"
                            </li>
                            <li>
                                <pre><code class="language-stscript">/repeat times=3 space=on bar</code></pre>
                                returns "bar bar bar"
                            </li>
                        </ul>
                    </div>
                `
    })
  );
}

function attachReactElement() {
  // Choose the root container for the extension's main UI
  const rootContainer = document.getElementById("top-settings-holder");

  if (rootContainer) {
    const rootElement = document.createElement("div");
    rootContainer.appendChild(rootElement);
    rootElement.className = "drawer";
    rootElement.id = "music-box-extension-container";
    const root = createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <Settings />
      </React.StrictMode>
    );
  }
}

function main() {
  console.log("[music-box] Initialization Started");
  attachReactElement();
  createSlashCommands();
  console.log("[music-box] Initialization Finished");
}

main();
