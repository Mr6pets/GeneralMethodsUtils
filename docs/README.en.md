# general-method-utils

A comprehensive JavaScript utility library providing common methods for web development, including cookie management, URL handling, device detection, HTTP requests, and more. Supports both JavaScript and TypeScript.

## Features

- **Modular Design**: Easy to import specific modules.
- **Cross-Platform**: Works in browsers and Node.js.
- **TypeScript Support**: Full type definitions for better development experience.
- **Lightweight**: Minimal dependencies, optimized for performance.

## Installation

Install via npm:

```bash
npm install general-method-utils
```

Or yarn:

```bash
yarn add general-method-utils
```

## Quick Start

### ES6 Modules

```javascript
import { setCookie, getCookie } from 'general-method-utils';

setCookie('username', 'JohnDoe', { expires: 7 });
console.log(getCookie('username')); // JohnDoe
```

### CommonJS

```javascript
const utils = require('general-method-utils');

utils.setCookie('username', 'JohnDoe', { expires: 7 });
console.log(utils.getCookie('username')); // JohnDoe
```

### Browser

```html
<script src="https://unpkg.com/general-method-utils/dist/index.umd.js"></script>
<script>
  GeneralMethodsUtils.setCookie('username', 'JohnDoe', { expires: 7 });
  console.log(GeneralMethodsUtils.getCookie('username')); // JohnDoe
</script>
```

## API Documentation

### Cookie Utils

- `setCookie(name: string, value: string, options?: CookieOptions)`: Set a cookie.
- `getCookie(name: string): string | null`: Get a cookie value.
- `removeCookie(name: string, options?: CookieOptions)`: Remove a cookie.
- `clearCookies(options?: CookieOptions)`: Clear all cookies.

Example:
```javascript
setCookie('theme', 'dark', { path: '/', expires: 30 });
```

### URL Utils

- `parseURL(url: string): URLParams`: Parse URL parameters.
- `buildURL(base: string, params: URLParams): string`: Build URL with parameters.
- `getQueryParam(name: string): string | null`: Get query parameter from current URL.
- `setQueryParam(name: string, value: string)`: Set query parameter in current URL.

Example:
```javascript
const params = parseURL('https://example.com?foo=bar');
console.log(params); // { foo: 'bar' }
```

### Device Detection

- `getDeviceType(): DeviceType`: Get device type (mobile/desktop).
- `getOS(): OSType`: Get operating system.
- `getBrowserInfo(): BrowserInfo`: Get browser information.
- `isMobile(): boolean`: Check if mobile device.

Example:
```javascript
console.log(getDeviceType()); // 'mobile' or 'desktop'
```

### HTTP Requests

- `get(url: string, options?: RequestOptions): Promise<any>`: GET request.
- `post(url: string, data: any, options?: RequestOptions): Promise<any>`: POST request.
- `put(url: string, data: any, options?: RequestOptions): Promise<any>`: PUT request.
- `del(url: string, options?: RequestOptions): Promise<any>`: DELETE request.
- `retryRequest(fn: Function, options: RetryOptions): Promise<any>`: Retry failed requests.

Example:
```javascript
post('/api/user', { name: 'John' }).then(response => console.log(response));
```

### Internationalization (i18n)

- `formatNumber(value: number, locale?: string): string`: Format number.
- `formatCurrency(value: number, currency: string, locale?: string): string`: Format currency.
- `formatDate(date: Date, locale?: string, options?: Intl.DateTimeFormatOptions): string`: Format date.
- `formatRelativeTime(value: number, unit: string, locale?: string): string`: Format relative time.
- `formatPercent(value: number, locale?: string): string`: Format percentage.

Example:
```javascript
console.log(formatCurrency(1234.56, 'USD', 'en-US')); // $1,234.56
```

### Crypto Utils

- `hash(data: string, algorithm: string = 'SHA-256'): Promise<string>`: Hash data.
- `generateRandomString(length: number): string`: Generate random string.
- `generateUUIDv4(): string`: Generate UUID v4.
- `encodeBase64(data: string): string`: Base64 encode.
- `decodeBase64(data: string): string`: Base64 decode.
- `secureRandom(min: number, max: number): number`: Secure random number.

Example:
```javascript
console.log(generateUUIDv4()); // e.g., '123e4567-e89b-12d3-a456-426614174000'
```

### Animation Utils

- `fadeIn(element: HTMLElement, duration: number): void`: Fade in element.
- `fadeOut(element: HTMLElement, duration: number): void`: Fade out element.
- `slideIn(element: HTMLElement, duration: number): void`: Slide in element.
- `slideOut(element: HTMLElement, duration: number): void`: Slide out element.
- `scale(element: HTMLElement, scale: number, duration: number): void`: Scale element.
- `bounce(element: HTMLElement, duration: number): void`: Bounce animation.
- `shake(element: HTMLElement, duration: number): void`: Shake animation.

Example:
```javascript
fadeIn(document.getElementById('box'), 500);
```

### Geo Utils

- `getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition>`: Get current position.
- `watchPosition(callback: PositionCallback, options?: PositionOptions): number`: Watch position changes.
- `clearWatch(id: number): void`: Clear position watch.
- `calculateDistance(pos1: GeolocationCoordinates, pos2: GeolocationCoordinates): number`: Calculate distance.
- `toDegrees(radians: number): number`: Convert radians to degrees.
- `calculateBearing(pos1: GeolocationCoordinates, pos2: GeolocationCoordinates): number`: Calculate bearing.
- `isWithinRadius(pos1: GeolocationCoordinates, pos2: GeolocationCoordinates, radius: number): boolean`: Check if within radius.

Example:
```javascript
getCurrentPosition().then(position => console.log(position.coords));
```

### Form Utils

- `serializeForm(form: HTMLFormElement): Record<string, any>`: Serialize form data.
- `serializeFormToQuery(form: HTMLFormElement): string`: Serialize to query string.
- `populateForm(form: HTMLFormElement, data: Record<string, any>): void`: Populate form with data.
- `resetForm(form: HTMLFormElement): void`: Reset form.
- `validateForm(form: HTMLFormElement, rules: ValidationRules): ValidationResult`: Validate form.
- `autoSaveForm(form: HTMLFormElement, key: string, interval: number): void`: Auto-save form.
- `restoreForm(form: HTMLFormElement, key: string): void`: Restore form from storage.

Example:
```javascript
validateForm(document.getElementById('myForm'), { email: { required: true, email: true } });
```

## Contribution

Contributions are welcome! Please submit a pull request or open an issue.

## License

MIT License.