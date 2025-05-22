import { IExtenstionSettings } from "@/models/ExtensionSettings";
import { getContext } from "@ST/scripts/extensions.js";

const globalContext = getContext();

interface ILoginButtonProps {
  extensionSettings: IExtenstionSettings;
}

function tryGetToken() {
  // https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps#redirecting
  console.log("[Music box] tryGetToken");
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get("source");
  if (source !== "youtube") {
    return null;
  }
  const params = new URLSearchParams(window.location.href);

  console.log("[Music Box] urlParams = ", urlParams);
  console.log("[Music Box] params = ", params);
  const access_token = params.get("access_token");
  if (access_token) {
    globalContext.extensionSettings["Music Box"].token = access_token;
    globalContext.saveSettingsDebounced();
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function attachTokenListner() {
  globalContext.eventSource.on(
    globalContext.event_types.APP_READY,
    tryGetToken
  );
}

export const LoginButton: React.FC<ILoginButtonProps> = ({
  extensionSettings
}) => {
  const login = (clientId: string) => {
    const callbackUrl = `${window.location.origin}/callback/youtube`;
    const googleClientId = clientId;
    const targetUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", targetUrl);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params = {
      client_id: googleClientId,
      redirect_uri: callbackUrl,
      response_type: "token",
      scope: "https://www.googleapis.com/auth/youtube.force-ssl",
      include_granted_scopes: "true",
      state: "pass-through value"
    };

    // Add form parameters as hidden input values.
    for (const p in params) {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      // @ts-expect-error blah
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  };
  attachTokenListner();
  return (
    <button
      className="menu_button menu_button_icon interactable"
      onClick={() => login(extensionSettings.clientId)}
    >
      Sign in
    </button>
  );
};
