import { Request, Response } from 'express';
import { CreateUserInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserByID } from '../service/user.service';
import sendEmail from '../utils/mailer';

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {

  const body = req.body;

  try {
    const user = await createUser(body);

    // send verification email
    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      subject: "Please verify your account",
      text: `verification code ${user.verificationCode}. Id: ${user._id}`,
    });

    return res.send("User created successfully");
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("User already exists");
    }

    return res.status(500).send(e);
  }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // find the user by id
  const user = await findUserByID(id);

  if (!user) {
    return res.send('Could not verify user')
  }

  if (user.verified) {
    return res.send('User is already verified')
  }

  if (user.verificationCode === verificationCode) {
    user.verified = true
    await user.save();
    return res.send("user successfully verified");
  }

  return res.send("Could not verify user");
}