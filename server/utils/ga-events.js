import ReactGA from "react-ga4";

export const trackEvent = (category, action, label) => {
    if (import.meta.env.PROD) {
        ReactGA.event({ category, action, label })
    } else {
        console.log(`[GA Debug] Category: ${category}, Action: ${action}, Label: ${label}`);
    }
}

