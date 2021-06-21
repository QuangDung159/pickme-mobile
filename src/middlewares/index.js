const handleTokenStatusMiddleware = (response, next) => {
    console.log('response :>> ', response);
    if (response.status === 401 && response.headers?.tokenexpired) {
        next;
    }
};

export default {
    handleTokenStatusMiddleware
};
