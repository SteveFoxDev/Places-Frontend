import { useState, useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import "./Auth.css";

export default function Auth() {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    let body, headers;

    if (isLogin) {
      body = JSON.stringify({
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      });
      headers = { "Content-Type": "application/json" };
    } else {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", formState.inputs.image.value);
      body = formData;
    }

    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/users/${isLogin ? "login" : "signup"}`,
        "POST",
        body,
        headers
      );
      if (responseData.userId) {
        auth.login(responseData.userId, responseData.token);
      }
    } catch (err) {
      console.log();
    }
  };

  const switchModeHandler = () => {
    // check isLogin (based on prev value), if form is in Login Mode
    // remove name input from formState, else set name back into formState
    if (!isLogin) {
      delete formState.inputs.name;
      delete formState.inputs.image;
      setFormData(
        { ...formState.inputs },
        // in case someone puts in email/pass then goes to signup then back to login
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogin((prevMode) => !prevMode);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}

        <h2>{isLogin ? "LOGIN" : "SIGNUP"}</h2>
        <Button inverse={!isLogin} onClick={switchModeHandler}>
          LOGIN
        </Button>
        <Button inverse={isLogin} onClick={switchModeHandler}>
          SIGNUP
        </Button>
        <form className="" onSubmit={authSubmitHandler}>
          {!isLogin && (
            <Input
              id="name"
              type="text"
              label="Name"
              element="input"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Name is Required, Please enter your name"
              onInput={inputHandler}
            />
          )}
          {!isLogin && <ImageUpload center id="image" onInput={inputHandler} />}
          <Input
            id="email"
            type="text"
            label="Email"
            element="input"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            errorText="Please Enter a Valid Email"
            onInput={inputHandler}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            element="input"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
            errorText="Please Enter a Valid Password (min 8 characters)"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
      </Card>
    </>
  );
}
