
export function throttle(fn, wait = 2000, immediately = false) {
    let latestTime = Date.now();
    let _immediately_ = immediately;
    return function () {
        if (!_immediately_) {
            fn.apply(this, arguments);
            _immediately_ = true;
        } else {
            let curTime = Date.now();
            if (curTime >= latestTime + wait) {
                fn.apply(this, arguments);
                latestTime = curTime;
            }
        }
    }
};
export function debunce(fn, wait = 2000, immediately = false) {
	let timer = null;
	let	_immediately_ = immediately;
	return function() {
		if (_immediately_) {
			fn.apply(this, arguments);
			_immediately_ = false;
		} else {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn.apply(this, arguments);
			}, wait)
		}
	}
}