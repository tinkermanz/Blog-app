const storeInsession = (key, value) => {
	sessionStorage.setItem(key, value);
};

const lookInSession = (key) => {
	return sessionStorage.getItem(key);
};

const removefromSession = (key) => {
	return sessionStorage.removeItem(key);
};

const logOutUser = () => {
	sessionStorage.clear();
};

export { storeInsession, lookInSession, removefromSession, logOutUser };
