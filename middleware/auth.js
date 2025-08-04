/**
 * Authentication and Authorization Middleware
 */

/**
 * Authentication and Authorization Middleware
 */

exports.requireAuth = function (req, res, next) {
    if (!req.session.user) return res.redirect('/u/login');
    next();
};

exports.requireAdmin = function (req, res, next) {
    if (!req.session.user) return res.redirect('/u/login');
    if (!req.session.user.role || req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
        message: 'Access Denied',
        error: { status: 403, stack: 'You do not have permission to access this resource.' }
        });
    }
    next();
};



exports.requireQuestionEdit = function (req, res, next) {
    if (!req.session.user) return res.redirect('/u/login');
    if (!req.session.user.role || req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
        message: 'Access Denied',
        error: { status: 403, stack: 'Only administrators can edit or delete questions.' }
        });
    }
    next();
};

exports.isAdmin = function(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
    return next();
}
    return res.status(403).render('unauthorized', { title: 'Access Denied' });
}

exports.isLoggedIn = function (req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Inject user object into all views
exports.attachUserToLocals = function (req, res, next) {
    res.locals.user = req.session.user || null;
    next();
};




