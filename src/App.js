import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const url = "https://api-inventariolibros-ricaldone.herokuapp.com/api";

class App extends Component {
 state = {
  data: [],
  modalInsertar: false,
  modalEliminar: false,
  form: {
   id: "",
   titulo: "",
   autor: "",
   edicion: "",
   tipoModal: "",
  },
 };

 peticionGet = () => {
  axios
   .get(url)
   .then((response) => {
    this.setState({ data: response.data });
   })
   .catch((error) => {
    console.log(error.message);
   });
 };

 peticionPost = async () => {
  delete this.state.form.id;
  await axios
   .post(url, this.state.form)
   .then((response) => {
    this.modalInsertar();
    this.peticionGet();
   })
   .catch((error) => {
    console.log(error.message);
   });
 };

 peticionPut = () => {
  axios
   .put(url + "/" + this.state.form.id, this.state.form)
   .then((response) => {
    this.modalInsertar();
    this.peticionGet();
   });
 };

 peticionDelete = () => {
  axios.delete(url + "/" + this.state.form.id).then((response) => {
   this.setState({ modalEliminar: false });
   this.peticionGet();
  });
 };

 modalInsertar = () => {
  this.setState({ modalInsertar: !this.state.modalInsertar });
 };

 seleccionarLibro = (libro) => {
  this.setState({
   tipoModal: "actualizar",
   form: {
    id: libro.id,
    titulo: libro.titulo,
    autor: libro.autor,
    edicion: libro.edicion,
   },
  });
 };

 handleChange = async (e) => {
  e.persist();
  await this.setState({
   form: {
    ...this.state.form,
    [e.target.titulo]: e.target.value,
   },
  });
  console.log(this.state.form);
 };

 componentDidMount() {
  this.peticionGet();
 }

 render() {
  const { form } = this.state;
  return (
   <div className="App">
    <br />
    <br />
    <br />
    <button
     className="btn btn-success"
     onClick={() => {
      this.setState({ form: null, tipoModal: "insertar" });
      this.modalInsertar();
     }}
    >
     Agregar Libro
    </button>
    <br />
    <br />
    <table className="table ">
     <thead>
      <tr>
       <th>ID</th>
       <th>titulo</th>
       <th>autor</th>
       <th>edicion</th>
       <th>Acciones</th>
      </tr>
     </thead>
     <tbody>
      {this.state.data.map((libro, index) => {
       return (
        <tr key={index}>
         <td>{libro.id}</td>
         <td>{libro.titulo}</td>
         <td>{libro.autor}</td>
         <td>{new Intl.NumberFormat("en-EN").format(libro.edicion)}</td>
         <td>
          <button
           className="btn btn-primary"
           onClick={() => {
            this.seleccionarLibro(libro);
            this.modalInsertar();
           }}
          >
           <FontAwesomeIcon icon={faEdit} />
          </button>
          {"   "}
          <button
           className="btn btn-danger"
           onClick={() => {
            this.seleccionarLibro(libro);
            this.setState({ modalEliminar: true });
           }}
          >
           <FontAwesomeIcon icon={faTrashAlt} />
          </button>
         </td>
        </tr>
       );
      })}
     </tbody>
    </table>

    <Modal isOpen={this.state.modalInsertar}>
     <ModalHeader style={{ display: "block" }}>
      <span style={{ float: "right" }} onClick={() => this.modalInsertar()}>
       x
      </span>
     </ModalHeader>
     <ModalBody>
      <div className="form-group">
       <label htmlFor="id">ID</label>
       <input
        className="form-control"
        type="text"
        name="id"
        id="id"
        readOnly
        onChange={this.handleChange}
        value={form ? form.id : this.state.data.length + 1}
       />
       <br />
       <label htmlFor="titulo">Titulo</label>
       <input
        className="form-control"
        type="text"
        name="titulo"
        id="titulo"
        onChange={this.handleChange}
        value={form ? form.titulo : ""}
       />
       <br />
       <label htmlFor="autor">Autor</label>
       <input
        className="form-control"
        type="text"
        name="autor"
        id="autor"
        onChange={this.handleChange}
        value={form ? form.autor : ""}
       />
       <br />
       <label htmlFor="edicion">edicion</label>
       <input
        className="form-control"
        type="text"
        name="edicion"
        id="edicion"
        onChange={this.handleChange}
        value={form ? form.edicion : ""}
       />
      </div>
     </ModalBody>

     <ModalFooter>
      {this.state.tipoModal === "insertar" ? (
       <button className="btn btn-success" onClick={() => this.peticionPost()}>
        Insertar
       </button>
      ) : (
       <button className="btn btn-primary" onClick={() => this.peticionPut()}>
        Actualizar
       </button>
      )}
      <button className="btn btn-danger" onClick={() => this.modalInsertar()}>
       Cancelar
      </button>
     </ModalFooter>
    </Modal>

    <Modal isOpen={this.state.modalEliminar}>
     <ModalBody>
      Estás seguro que deseas eliminar el Libro {form && form.titulo}
     </ModalBody>
     <ModalFooter>
      <button className="btn btn-danger" onClick={() => this.peticionDelete()}>
       Sí
      </button>
      <button
       className="btn btn-secundary"
       onClick={() => this.setState({ modalEliminar: false })}
      >
       No
      </button>
     </ModalFooter>
    </Modal>
   </div>
  );
 }
}

export default App;
