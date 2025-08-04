/**
 * Authentication and Authorization Middleware
 */

exports.requireAuth = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/u/login');
    }
    next();
};

exports.requireAdmin = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/u/login');
    }
    
    
    if (!req.session.user.roles || !req.session.user.roles.includes('admin')) {
        return res.status(403).render('error', { 
            message: 'Access Denied', 
            error: { status: 403, stack: 'You do not have permission to access this resource.' }
        });
    }
    
    next();
};

exports.requireQuestionEdit = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/u/login');
    }
    
    
    if (!req.session.user.roles || !req.session.user.roles.includes('admin')) {
        return res.status(403).render('error', { 
            message: 'Access Denied', 
            error: { status: 403, stack: 'Only administrators can edit or delete questions.' }
        });
    }
    
    next();
};

module.exports((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


