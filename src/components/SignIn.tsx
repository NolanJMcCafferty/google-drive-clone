import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();

  function signIn() {
    signInWithPopup(auth, provider)
    .then((result) => {
      navigate('/drive');
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
  }
  
  return (
    <Container style={{
      paddingTop: 100,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex'
    }}>
      <Button
        variant="contained" 
        onClick={signIn}
      >
        Sign in with Google
      </Button>
    </Container>
  )
}
