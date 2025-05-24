import { IExtenstionSettings } from "@/models/ExtensionSettings";

interface ILoginButtonProps {
  extensionSettings: IExtenstionSettings;
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
  return (
    <button
      className="menu_button menu_button_icon interactable"
      onClick={() => login(extensionSettings.clientId)}
    >
      Sign in
    </button>
  );
};
