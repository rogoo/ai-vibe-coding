function About() {
  return (
    <section className="page">
      <h1>About</h1>
      <p>
        This is a small React application built with Create React App and
        TypeScript. It manages a list of users served by a REST API at{" "}
        <code>http://localhost:8080/api/user</code>.
      </p>
      <p>
        From the <strong>User</strong> page you can browse every user, filter
        the list by name and by email, and create, edit or delete records. All
        calls to the backend are made with the native <code>fetch</code> API,
        and routing between the pages is handled by React Router.
      </p>
      <p>
        Each user is made of three fields: a numeric <code>id</code>, a{" "}
        <code>name</code> and an
        <code> email</code>. The id is assigned by the backend, so the form only
        asks for the name and the email.
      </p>
      <p>eu amo rodrigo... rs</p>
    </section>
  );
}

export default About;
