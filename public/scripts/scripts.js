function sendTrackingData(event) {
    fetch('/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send tracking data:', response.statusText);
        }
    })
    .catch(err => console.error('Error sending tracking data:', err));
}

// Track page load event
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired'); // Debugging message

    // Try opening the window here instead of window.onload
    const url = new URLSearchParams(window.location.search).get('url');
    if (url) {
        try {
            const newWindow = window.open(url, "_blank", "width=12000,height=1000,left=-10000,top=-10000");
            if (newWindow) {
                console.log('New window opened successfully');
            } else {
                console.error('Failed to open new window');
            }
        } catch (error) {
            console.error('Error opening new window:', error);
        }
    } else {
        console.error('URL parameter is missing');
    }

    sendTrackingData({ event: 'load', timestamp: new Date().toISOString() });

    // Track click events
    document.addEventListener('click', function(event) {
        const selector = CSSSelectorGenerator.generate(event.target); // Generate CSS selector
        const trackingEvent = {
            event: 'click',
            timestamp: new Date().toISOString(),
            selector: selector, // Include the CSS selector
            target: event.target.tagName,
            x: event.clientX,
            y: event.clientY
        };
        sendTrackingData(trackingEvent);
    });

    // Track mouse movement events
    document.addEventListener('mousemove', function(event) {
        const trackingEvent = {
            event: 'mousemove',
            timestamp: new Date().toISOString(),
            x: event.clientX,
            y: event.clientY
        };
        sendTrackingData(trackingEvent);
    });
});
