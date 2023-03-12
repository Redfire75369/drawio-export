export function handleRejection(action: string) {
	return function (e: any) {
		console.error(`${action} failed with`, e);
	};
}

export function debugMessage(debug: boolean, ...messages: any[]) {
	if (debug) {
		console.debug(...messages);
	}
}
