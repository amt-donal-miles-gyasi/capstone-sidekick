import passport from 'passport'

export const userAuthentication = passport.authenticate('local', { session: false })