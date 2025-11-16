// Weather service using OpenWeatherMap API
// Free tier: 60 calls/minute, 1M calls/month

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherData = async (location) => {
    if (!WEATHER_API_KEY) {
        console.warn('OpenWeatherMap API key not configured');
        return null;
    }

    if (!location || location.trim() === '') {
        return null;
    }

    try {
        const url = `${WEATHER_API_URL}?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=imperial`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error('Weather API error:', response.status);
            return null;
        }

        const data = await response.json();

        return {
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed),
            windDirection: getWindDirection(data.wind.deg),
            windGust: data.wind.gust ? Math.round(data.wind.gust) : null,
            conditions: data.weather[0].main,
            description: data.weather[0].description,
            location: data.name
        };
    } catch (error) {
        console.error('Failed to fetch weather:', error);
        return null;
    }
};

// Convert degrees to cardinal direction
const getWindDirection = (degrees) => {
    if (degrees === undefined || degrees === null) return 'Unknown';

    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((degrees % 360) / 22.5);
    return directions[index % 16];
};

export const formatWeatherForPrompt = (weather) => {
    if (!weather) return '';

    let weatherInfo = `\n\nWeather Conditions:`;
    weatherInfo += `\n- Temperature: ${weather.temperature}°F (feels like ${weather.feelsLike}°F)`;
    weatherInfo += `\n- Wind: ${weather.windSpeed} mph from ${weather.windDirection}`;

    if (weather.windGust) {
        weatherInfo += ` (gusts to ${weather.windGust} mph)`;
    }

    weatherInfo += `\n- Conditions: ${weather.description}`;
    weatherInfo += `\n- Humidity: ${weather.humidity}%`;

    return weatherInfo;
};
