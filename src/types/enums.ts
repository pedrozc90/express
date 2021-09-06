export const HttpStatus = {
	CONTINUE: 100, // "Continue"
	SWITCHING_PROTOCOLS: 101, // "Switching Protocols"
	PROCESSING: 102, // "Processing"
	EARLY_HINTS: 103, // "Early Hints"
	OK: 200, // "Ok"
	CREATED: 201, // "Created"
	ACCEPTED: 202, // "Accepted"
	NON_AUTHORITATIVE_INFORMATION: 203, // "Non-Authoritative Information"
	NO_CONTENT: 204, // "No Content"
	RESET_CONTENT: 205, // "Reset Content"
	PARTIAL_CONTENT: 206, // "Partial Content"
	MULTI_STATUS: 207, // "Multi Status"
	ALREADY_IMPORTED: 208, // "Already imported"
	IM_USED: 226, // "IM Used"
	MULTIPLE_CHOICES: 300, // "Multiple Choices"
	MOVED_PERMANENTLY: 301, // "Moved Permanently"
	FOUND: 302, // "Found"
	SEE_OTHER: 303, // "See Other"
	NOT_MODIFIED: 304, // "Not Modified"
	USE_PROXY: 305, // "Use Proxy"
	SWITCH_PROXY: 306, // "Switch Proxy"
	TEMPORARY_REDIRECT: 307, // "Temporary Redirect"
	PERMANENT_REDIRECT: 308, // "Permanent Redirect"
	BAD_REQUEST: 400, // "Bad Request"
	UNAUTHORIZED: 401, // "Unauthorized"
	PAYMENT_REQUIRED: 402, // "Payment Required"
	FORBIDDEN: 403, // "Forbidden"
	NOT_FOUND: 404, // "Not Found"
	METHOD_NOT_ALLOWED: 405, // "Method Not Allowed"
	NOT_ACCEPTABLE: 406, // "Not Acceptable"
	PROXY_AUTHENTICATION_REQUIRED: 407, // "Proxy Authentication Required"
	REQUEST_TIMEOUT: 408, // "Request Timeout"
	CONFLICT: 409, // "Conflict"
	GONE: 410, // "Gone"
	LENGTH_REQUIRED: 411, // "Length Required"
	PRECONDITION_FAILED: 412, // "Precondition Failed"
	REQUEST_ENTITY_TOO_LARGE: 413, // "Request Entity Too Large"
	REQUEST_URI_TOO_LONG: 414, // "Request-URI Too Long"
	UNSUPPORTED_MEDIA_TYPE: 415, // "Unsupported Media Type"
	REQUESTED_RANGE_NOT_SATISFIABLE: 416, // "Requested Range Not Satisfiable"
	EXPECTATION_FAILED: 417, // "Expectation Failed"
	I_AM_A_TEAPOT: 418, // "I am a teapot"
	ENHANCE_YOUR_CALM: 420, // "Enhance your calm"
	MISDIRECTED_REQUEST: 421, // "Misdirected Request"
	UNPROCESSABLE_ENTITY: 422, // "Unprocessable Entity"
	LOCKED: 423, // "Locked"
	FAILED_DEPENDENCY: 424, // "Failed Dependency"
	TOO_EARLY: 425, // "Too Early"
	UPGRADE_REQUIRED: 426, // "Upgrade Required"
	PRECONDITION_REQUIRED: 428, // "Precondition Required"
	TOO_MANY_REQUESTS: 429, // "Too Many Requests"
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431, // "Request Header Fields Too Large"
	NO_RESPONSE: 444, // "No Response"
	BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS: 450, // "Blocked by Windows Parental Controls"
	UNAVAILABLE_FOR_LEGAL_REASONS: 451, // "Unavailable For Legal Reasons"
	REQUEST_HEADER_TOO_LARGE: 494, // "Request Header Too Large"
	INTERNAL_SERVER_ERROR: 500, // "Internal Server Error"
	NOT_IMPLEMENTED: 501, // "Not Implemented"
	BAD_GATEWAY: 502, // "Bad Gateway"
	SERVICE_UNAVAILABLE: 503, // "Service Unavailable"
	GATEWAY_TIMEOUT: 504, // "Gateway Timeout"
	HTTP_VERSION_NOT_SUPPORTED: 505, // "HTTP Version Not Supported"
	VARIANT_ALSO_NEGOTIATES: 506, // "Variant Also Negotiates"
	INSUFFICIENT_STORAGE: 507, // "Insufficient Storage"
	LOOP_DETECTED: 508, // "Loop Detected"
	BANDWIDTH_LIMIT_EXCEEDED: 509, // "Bandwidth Limit Exceeded"
	NOT_EXTENDED: 510, // "Not Extended"
	NETWORK_AUTHENTICATION_REQUIRED: 511, // "Network Authentication Required"
	CONNECTION_TIMED_OUT: 522, // "Connection Timed Out"
} as const;

export const HttpStatusMessage: Record<keyof typeof HttpStatus, string> = {
	CONTINUE: "Continue",
	SWITCHING_PROTOCOLS: "Switching Protocols",
	PROCESSING: "Processing",
	EARLY_HINTS: "Early Hints",
	OK: "Ok",
	CREATED: "Created",
	ACCEPTED: "Accepted",
	NON_AUTHORITATIVE_INFORMATION: "Non-Authoritative Information",
	NO_CONTENT: "No Content",
	RESET_CONTENT: "Reset Content",
	PARTIAL_CONTENT: "Partial Content",
	MULTI_STATUS: "Multi Status",
	ALREADY_IMPORTED: "Already imported",
	IM_USED: "IM Used",
	MULTIPLE_CHOICES: "Multiple Choices",
	MOVED_PERMANENTLY: "Moved Permanently",
	FOUND: "Found",
	SEE_OTHER: "See Other",
	NOT_MODIFIED: "Not Modified",
	USE_PROXY: "Use Proxy",
	SWITCH_PROXY: "Switch Proxy",
	TEMPORARY_REDIRECT: "Temporary Redirect",
	PERMANENT_REDIRECT: "Permanent Redirect",
	BAD_REQUEST: "Bad Request",
	UNAUTHORIZED: "Unauthorized",
	PAYMENT_REQUIRED: "Payment Required",
	FORBIDDEN: "Forbidden",
	NOT_FOUND: "Not Found",
	METHOD_NOT_ALLOWED: "Method Not Allowed",
	NOT_ACCEPTABLE: "Not Acceptable",
	PROXY_AUTHENTICATION_REQUIRED: "Proxy Authentication Required",
	REQUEST_TIMEOUT: "Request Timeout",
	CONFLICT: "Conflict",
	GONE: "Gone",
	LENGTH_REQUIRED: "Length Required",
	PRECONDITION_FAILED: "Precondition Failed",
	REQUEST_ENTITY_TOO_LARGE: "Request Entity Too Large",
	REQUEST_URI_TOO_LONG: "Request-URI Too Long",
	UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",
	REQUESTED_RANGE_NOT_SATISFIABLE: "Requested Range Not Satisfiable",
	EXPECTATION_FAILED: "Expectation Failed",
	I_AM_A_TEAPOT: "I am a teapot",
	ENHANCE_YOUR_CALM: "Enhance your calm",
	MISDIRECTED_REQUEST: "Misdirected Request",
	UNPROCESSABLE_ENTITY: "Unprocessable Entity",
	LOCKED: "Locked",
	FAILED_DEPENDENCY: "Failed Dependency",
	TOO_EARLY: "Too Early",
	UPGRADE_REQUIRED: "Upgrade Required",
	PRECONDITION_REQUIRED: "Precondition Required",
	TOO_MANY_REQUESTS: "Too Many Requests",
	REQUEST_HEADER_FIELDS_TOO_LARGE: "Request Header Fields Too Large",
	NO_RESPONSE: "No Response",
	BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS: "Blocked by Windows Parental Controls",
	UNAVAILABLE_FOR_LEGAL_REASONS: "Unavailable For Legal Reasons",
	REQUEST_HEADER_TOO_LARGE: "Request Header Too Large",
	INTERNAL_SERVER_ERROR: "Internal Server Error",
	NOT_IMPLEMENTED: "Not Implemented",
	BAD_GATEWAY: "Bad Gateway",
	SERVICE_UNAVAILABLE: "Service Unavailable",
	GATEWAY_TIMEOUT: "Gateway Timeout",
	HTTP_VERSION_NOT_SUPPORTED: "HTTP Version Not Supported",
	VARIANT_ALSO_NEGOTIATES: "Variant Also Negotiates",
	INSUFFICIENT_STORAGE: "Insufficient Storage",
	LOOP_DETECTED: "Loop Detected",
	BANDWIDTH_LIMIT_EXCEEDED: "Bandwidth Limit Exceeded",
	NOT_EXTENDED: "Not Extended",
	NETWORK_AUTHENTICATION_REQUIRED: "Network Authentication Required",
	CONNECTION_TIMED_OUT: "Connection Timed Out",
};
