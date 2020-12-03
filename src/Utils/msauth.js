// authProvider.js
import { MsalAuthProvider, LoginType } from 'react-aad-msal';
 
// Msal Configurations
const config = {
  auth: {
    authority: 'https://login.microsoftonline.com/d295e96c-4795-4965-8610-65ad437c3ff2',
    clientId: 'a7b35f3c-f82f-457a-8555-07bc56d25464',
    redirectUri: process.env.REACT_APP_REDIRECT_URI
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};
 
// Authentication Parameters
  const authenticationParameters = {
    scopes: [
      'user.read',
    ]
  }

  const planningAuthenticationParameters = {
    scopes: [
      'api://1039b1ea-694d-48f0-bc67-90c533b3b570/Files.Read'
    ]
  }

  // Options
const options = {
  loginType:LoginType.Popup
}
 
export const authProvider = new MsalAuthProvider(config, authenticationParameters, options)

export const planningAuthProvider = new MsalAuthProvider(config, planningAuthenticationParameters, options)
