import React, { useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetUsers {
    users {
      id
      name
      age
      userName
      nationality
      friends {
        name
        age
      }
    }
  }
`;

const QUERY_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      year
      isInTheaters
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      userName
      age
      nationality
    }
  }
`;

const ShowData = () => {
  const { data: userList, refetch } = useQuery(QUERY_ALL_USERS);
  const [fetchMovie, { data: movieData, loading: movieLoading, error: movieError } ] = useLazyQuery(QUERY_MOVIE_BY_NAME);
  const [ createUser ] = useMutation(CREATE_USER_MUTATION);
  console.log(userList, "userList fetched");

  if(movieError) {
    console.log(movieError,"movieError");
  }

  const [enteredMovieName, setEnteredMovieName] = useState("");
  console.log(enteredMovieName,"enteredMovieName");

  const submitHandler = (event) => {
    try {
      event.preventDefault();
      console.log(event.target);
      const name = event.target.name.value;
      const userName = event.target.userName.value;
      const age = +event.target.age.value;
      const nationality = (event.target.nationality.value).toUpperCase();

      createUser({variables: {input: {name, userName, age, nationality}}});
      event.target.name.value = "";
      event.target.userName.value = "";
      event.target.age.value = "";
      event.target.nationality.value = "";

      refetch();

    } catch (error) {
      console.log(error);
    }
  }

  const deleteUser = (id) => {
    try {
      
    } catch (error) {
      
    }
  }

  return (
    <div>
      {userList && userList.users.map((user, index) => (
        <div key={index} style={{background:"yellow", margin: "10px"}}>
          <strong>Name:</strong> {user.name}{" "}
          <strong>User Name:</strong> {user.userName}{" "}
          <strong>age:</strong> {user.age}{" "}
          <strong>Nationality:</strong> {user.nationality}{" "}
          {user.friends && user.friends.map((friend,index) => (
            <div key={index}>
              <strong>Friend Name:</strong> {friend.name}{" "}
              <strong>Friend Age:</strong> {friend.age}{" "}
            </div>
          ))}
          <button onClick={deleteUser.bind(null,user)}>Delete</button>
        </div>
      ))}
      <input 
        value={enteredMovieName} 
        placeholder="Movie Name"
        onChange={(event) => setEnteredMovieName(event.target.value)}
      />
      <button 
        onClick={() => {
          fetchMovie({variables:{
            name: enteredMovieName
          }})
        }}
      >
        Fetch Data
      </button>
      
      <div>
        {!movieLoading && movieData && <h3>{movieData.movie.name} - {movieData.movie.year}</h3>}
        {movieLoading && <h3>movie loading....</h3>}
        {movieError && <h3>There was an error!</h3>}
      </div>

      <form onSubmit={submitHandler} >
        <input placeholder="Name" id="name" type="text"/>
        <input placeholder="UserName" id="userName" type="text"/>
        <input placeholder="Age" id="age" type="text"/>
        <input placeholder="Nationality" id="nationality" type="text"/>
        <button>Add User</button>
      </form>
    </div>
  );
};

export default ShowData;
