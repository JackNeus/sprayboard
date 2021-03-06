let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "realsite.com") {
	backendHost = "https://api.realsite.com";
} else {
	backendHost = process.env.REACT_APP_BACKEND_HOST || "http://localhost:5000";
}

export const API_ROOT = `${backendHost}/api`;
