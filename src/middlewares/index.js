const handleTokenStatusMiddleware = (response, next) => {
    if (response.status === 401) {
        next();
    }
};

export default {
    handleTokenStatusMiddleware
};
