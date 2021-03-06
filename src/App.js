import React, { Component } from 'react';
import './App.css';
import { Button, ButtonToolbar, Modal, FormGroup, FormControl, ControlLabel, Collapse, Well } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <RecipeBox />

        <div className="footer">source code on <code><a href="https://github.com/kibrovic/Recipe-box">github</a></code></div>
      </div>
    );
  }
}

/*
-RecipeBox
  -Meal
    -Ingredients
-Modals
  -AddRecipe
  -EditRecipe
*/

class Ingredients extends Component {
  constructor(props) {
    super(props);
    this.getRecipe = this.getRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  getRecipe(target) {
    return recipeContainer.filter(i => i.name === target)[0];
  }

  deleteRecipe() {
    let index = recipeContainer.indexOf(this.getRecipe(this.props.name));
    recipeContainer.splice(index, 1);
    this.props.onRecipeUpdate(recipeContainer);
  }

  render() {
    let ingredients = this.props.ingredients.map((item, i) => <li key={i}>{item}</li>);
    return (
      <div className="Ingredients">
        <ul>
          {ingredients}
        </ul>

        <ButtonToolbar>
          <EditRecipe mealName={this.props.name} ingredients={this.props.ingredients} getRecipe={this.getRecipe} onRecipeUpdate={this.props.onRecipeUpdate}/>
          <Button bsStyle="danger" bsSize="small" onClick={this.deleteRecipe}>Delete</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

class Meal extends Component {
  constructor(...args) {
    super(...args);

    this.state = {};
  }

  render() {

    return (
      <div className="Meal">
        <div onClick={ ()=> this.setState({ open: !this.state.open })}>
          <h2>{this.props.name}</h2>
        </div>
        <Collapse in={this.state.open}>
          <div>
            <Well>
            <h3>Ingredients</h3>
            <hr/>
            <Ingredients name={this.props.name} ingredients={this.props.ingredients} onRecipeUpdate={this.props.onRecipeUpdate}/>
            </Well>
          </div>
        </Collapse>
      </div>
    );
  }
}

class RecipeBox extends Component {
  constructor(props) {
    super(props);
    this.state = {recipeContainer: recipeContainer};
    this.handleRecipeUpdate = this.handleRecipeUpdate.bind(this);
  }

  handleRecipeUpdate(recipeUpdate) {
    this.setState({
      "recipeContainer": recipeUpdate
    });
    localStorage.setItem("recipeContainer", JSON.stringify(recipeUpdate));
  }

  recipes(array) {
    this.state.recipeContainer.forEach((meal, index)=> {
      array.push(<Meal name={meal.name} ingredients={meal.ingredients} key={index} onRecipeUpdate={this.handleRecipeUpdate}/>)
    });
  }

  render() {
    let recipes =[];
    this.recipes(recipes);
    return (
      <div className="RecipeBox">
        <h1>Recipes</h1>
        {recipes}

        <ButtonToolbar className="addRecipe">
          <AddRecipe onRecipeUpdate={this.handleRecipeUpdate} />
        </ButtonToolbar>

      </div>
    );
  }
}

let recipeContainer = (typeof localStorage["recipeContainer"] !== "undefined") ? JSON.parse(localStorage.getItem("recipeContainer")) : [
  {"name": "Restaurant-Style Buffalo Chicken Wings", "ingredients": [
    "1/2 cup all-purpose flour",
    "1/4 teaspoon paprika",
    "1/4 teaspoon cayenne pepper",
    "1/4 teaspoon salt",
    "10 chicken wings",
    "oil for deep frying ",
    "1/4 cup butter ",
    "1/4 cup hot sauce ",
    "1 dash ground black pepper",
    "1 dash garlic powder"
  ]},
  {"name": "Banana Crumb Muffins", "ingredients": [
    "1 1/2 cups all-purpose flour",
    "1 teaspoon baking soda",
    "1 teaspoon baking powder",
    "1/2 teaspoon salt",
    "3 bananas, mashed",
    "3/4 cup white sugar",
    "1 egg, lightly beaten",
    "1/3 cup butter, melted",
    "1/3 cup packed brown sugar",
    "2 tablespoons all-purpose flour",
    "1/8 teaspoon ground cinnamon",
    "1 tablespoon butter"
  ]},
  {"name": "World's Best Lasagna", "ingredients": [
    "1 pound sweet Italian sausage",
    "3/4 pound lean ground beef",
    "1/2 cup minced onion",
    "2 cloves garlic, crushed",
    "1 (28 ounce) can crushed tomatoes",
    "2 (6 ounce) cans tomato paste",
    "2 (6.5 ounce) cans canned tomato sauce",
    "1/2 cup water",
    "2 tablespoons white sugar",
    "1 1/2 teaspoons dried basil leaves",
    "1/2 teaspoon fennel seeds",
    "1 teaspoon Italian seasoning",
    "1 tablespoon salt",
    "1/4 teaspoon ground black pepper",
    "4 tablespoons chopped fresh parsley",
    "12 lasagna noodles",
    "16 ounces ricotta cheese",
    "1 egg",
    "1/2 teaspoon salt",
    "3/4 pound mozzarella cheese, sliced",
    "3/4 cup grated Parmesan cheese"
  ]}
]

// Modals below
class AddRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      nameValue: '',
      ingredientsValue: ''
     };
    this.toggle = this.toggle.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIngredientsChange = this.handleIngredientsChange.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
  }

  toggle() {
    this.state.showModal ? this.setState({ showModal: false }) : this.setState({ showModal: true });
  }

  handleNameChange(e) {
    this.setState({ nameValue: e.target.value });
  }

  handleIngredientsChange(e) {
    this.setState({ ingredientsValue: e.target.value });
  }

  addRecipe() {
    (this.state.nameValue.length > 1 && this.state.ingredientsValue.length > 1) ? (
      recipeContainer.push({"name": this.state.nameValue, "ingredients": this.state.ingredientsValue.split("\n")}),
      this.props.onRecipeUpdate(recipeContainer),
      this.setState({ showModal: false })
    ) : (
      alert("Meal name or ingredients missing")
    );
  }

  render() {
    return (
      <div>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={this.toggle}
        >
          Add
        </Button>

        <Modal show={this.state.showModal} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title>Add Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup bsSize="large">
              <ControlLabel>Meal:</ControlLabel>
              <FormControl type="text" placeholder="Meal name:" value={this.state.nameValue} onChange={this.handleNameChange} />
            </FormGroup>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel>Ingredients: </ControlLabel>
              <FormControl componentClass="textarea" rows={5} placeholder="Enter ingredients - separate by newline (press Enter)" value={this.state.ingredientsValue} onChange={this.handleIngredientsChange} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button bsStyle="primary" onClick={this.addRecipe} >Add</Button>
              <Button onClick={this.toggle}>Close</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

class EditRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      nameValue: this.props.mealName,
      ingredientsValue: this.props.ingredients.join("\n")
    };
    this.toggle = this.toggle.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIngredientsChange = this.handleIngredientsChange.bind(this);
    this.updateRecipe = this.updateRecipe.bind(this);
  }

  toggle() {
    this.state.showModal ? this.setState({ showModal: false }) : this.setState({ showModal: true });
  }

  handleNameChange(e) {
    this.setState({ nameValue: e.target.value });
  }

  handleIngredientsChange(e) {
    this.setState({ ingredientsValue: e.target.value });
  }

  updateRecipe() {
    this.props.getRecipe(this.props.mealName).name = this.state.nameValue;
    this.props.getRecipe(this.props.mealName).ingredients = this.state.ingredientsValue.split("\n");
    this.props.onRecipeUpdate(recipeContainer);
    this.setState({ showModal: false })
  }

  render() {
    return (
      <div>
        <Button
          bsSize="small"
          onClick={this.toggle}
        >
          Edit
        </Button>

        <Modal show={this.state.showModal} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup bsSize="large">
              <ControlLabel>Meal:</ControlLabel>
              <FormControl type="text" defaultValue={this.props.mealName} ref={(input) => this.input = input} onChange={this.handleNameChange}/>
            </FormGroup>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel>Ingredients: </ControlLabel>
              <FormControl componentClass="textarea" rows={5} defaultValue={this.props.ingredients.join("\n")} ref={(input) => this.input = input} onChange={this.handleIngredientsChange}/>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button bsStyle="primary" onClick={this.updateRecipe}>Save</Button>
              <Button onClick={this.toggle}>Close</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default App;
