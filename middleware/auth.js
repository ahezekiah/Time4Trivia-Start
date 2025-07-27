/**
 * Authentication and Authorization Middleware
 */

// Middleware to check if user is logged in
exports.requireAuth = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/u/login');
    }
    next();
};

// Middleware to check if user is an admin
exports.requireAdmin = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/u/login');
    }
    
    // Check if user has admin role in session (server-side check)
    if (!req.session.user.roles || !req.session.user.roles.includes('admin')) {
        return res.status(403).render('error', { 
            message: 'Access Denied', 
            error: { status: 403, stack: 'You do not have permission to access this resource.' }
        });
    }
    
    next();
};

// Middleware to check if user can edit questions (admins only)
exports.requireQuestionEdit = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/u/login');
    }
    
    // Only admins can edit/delete questions
    if (!req.session.user.roles || !req.session.user.roles.includes('admin')) {
        return res.status(403).render('error', { 
            message: 'Access Denied', 
            error: { status: 403, stack: 'Only administrators can edit or delete questions.' }
        });
    }
    
    next();
};
