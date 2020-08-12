export const authMiddleware = async (resolver: any, _: any, __:any, context:any, ___:any) => {
    // Include your agent code as Authorization: <token> header.
    const auth = context.auth;
    // const permit = ctx.request.get('Authorization') === code
    console.log(auth);
    console.log(context.session.userId);
    if (auth === "pass") {
      return resolver()
    } else {
      throw new Error("Not authorised!")
    }
}