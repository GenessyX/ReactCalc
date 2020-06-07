import React, { useState } from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import { Container, Header, Content, Item } from 'native-base';

function createArray(m, n) {
    var arr = new Array(m);
    for (let i = 0; i < m; i++){
      arr[i] = new Array(n).fill(0);
    }
    return arr;
}


class MatrixInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {m: props.m, n: props.n};
        this.mUpdater = this.props.mUpdater.bind(this)
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps){
      this.setState({m: nextProps.m, n: nextProps.n})
    }

    render() {
        const matrix = [];
        for (let i = 0; i < this.state.n; i++) {
            const el = [];
            for (let j = 0; j < this.state.m; j++) {
                el.push(
                    <MatrixCell
                        key={[j, i]}
                        id={[j, i]}
                        updater={this.props.updater}
                    />
                )
            }
            matrix.push(
                <View
                    style={{ width: "20%", flexDirection: "column" }}
                    key={i}
                >
                    {el}
                </View>
            )
        }
        return (
            <View style={{ flexDirection: "row", width:"10%"}}>
                {matrix}
            </View>
        )
    }
}

class MatrixCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }

    handleChange(value){
      this.setState({value: value})
      this.props.updater(this.props.id, value);
    }

    render() {
        return (
            <TextInput style={{}}
                onChangeText={value => this.handleChange(value)}
                value={this.state.value.toString()}
            />
        )
    }
}

class InputSize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valueM: props.valueM,
            valueN: props.valueN
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    changeM(value) {
        this.setState({ valueM: value });
        this.props.handleM(value);
    }
    changeN(value) {
        this.setState({ valueN: value });
        this.props.handleN(value);
    }

    render() {
        return (
            <View style={{ flexDirection: "row", width: "10%" }} >
                <View style={{ /*backgroundColor: "blue",*/ flex: 0.5 }}>
                    <TextInput
                        style={{ width: '100%', margin: '5%', backgroundColor: '#FB8617' }}
                        placeholder={this.props.placeholderM}
                        onChangeText={value => this.changeM(value)}
                        value={this.state.valueM}
                    />
                </View>
                <View style={{ /*backgroundColor: "red",*/ flex: 0.5 }}>
                    <TextInput
                        style={{ width: '100%', margin: '5%', backgroundColor: '#E54493' }}
                        placeholder={this.props.placeholderN}
                        onChangeText={value => this.changeN(value)}
                        value={this.state.valueN}
                    />
                </View>
            </View>
        )
    }
}


class Matrix extends React.Component{
  constructor(props){
    super(props);
    this.state = {m: props.m, n: props.n, matrix: createArray(props.m, props.n)}
    this.handleChangeM = this.handleChangeM.bind(this);
    this.handleChangeN = this.handleChangeN.bind(this);
    this.updateElement = this.updateElement.bind(this);
    this.createMatrix  = this.createMatrix.bind(this);
    this.updateMatrix = this.updateMatrix.bind(this);
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }

  updateMatrixView(m, n){
    //console.log(m, n)
    this.setState({m: m, n: n})
  }

  updateElement(index, value){
      //console.log(index, value);
      let matrix = [...this.state.matrix];
      let row = [...matrix[index[0]]];
      row[index[1]] = parseInt(value);
      matrix[index[0]] = row;
      this.setState({matrix: matrix});
      this.props.parentSender(matrix);
  }

  createMatrix(m, n){
    let matrix = createArray(parseInt(m), parseInt(n));
    for (let i = 0; i < this.state.matrix.length; i++){
      for (let j = 0; j < this.state.matrix[0].length; j++){
        if (i <= (matrix.length-1) && j <= (matrix[0].length-1)){
          matrix[i][j] = this.state.matrix[i][j];
        }
      }
    }
    this.setState({matrix: matrix});
    this.props.parentSender(matrix);
  }

  updateMatrix(m, n) {
      if (n == null && m !== null){
          this.setState({m: m}, this.createMatrix(m, this.state.n));
          this.updateMatrixView(m, this.state.n)
      }
      if (m == null && n !== null){
          this.setState({n: n}, this.createMatrix(this.state.m, n));
          this.updateMatrixView(this.state.m, n)
      }
  }

  handleChangeM(value){
    this.setState({m: parseInt(value)})
    this.updateMatrix(value, null);
  }
  handleChangeN(value){
    this.setState({n: parseInt(value)})
    this.updateMatrix(null, value);
  }

  render() {
    //console.log(this.state)
    return (
        <View>
          <InputSize valueM={3} valueN={3} handleM={this.handleChangeM} handleN={this.handleChangeN} mUpdater={this.updateMatrixView}/>
          <MatrixInput m={this.state.m} n={this.state.n} updater={this.updateElement} mUpdater={this.updateMatrixView}/>
        </View>
    )
  }
}

class MatrixButtons extends React.Component {
    render() {
        return (
            <View style={{ flexDirection: "row", width: "40%" }}>
                <View style={{ flex: 0.2, margin: "0.5%" }}><Button title="+" color='#014A11' /></View>
                <View style={{ flex: 0.2, margin: "0.5%" }}><Button title="-" color='#385A01'/></View>
                <View style={{ flex: 0.2, margin: "0.5%" }}><Button title="*" color='#97E815' /></View>
                <View style={{ flex: 0.2, margin: "0.5%" }}><Button title="/" color='#ACED43' /></View>
            </View>
        )
    }
}

function matrix_sum(a, b){
  let c = createArray(a.length, a[0].length);
  for (let i = 0; i < a.length; i++){
    for (let j = 0; j < a[0].length; j++){
      c[i][j] = a[i][j] + b[i][j];
    }
  }
  return c;
}

function matrix_substract(a, b){
  let c = createArray(a.length, a[0].length);
  for (let i = 0; i < a.length; i++){
    for (let j = 0; j < a[0].length; j++){
      c[i][j] = a[i][j] - b[i][j];
    }
  }
  return c;
}

function matrix_mult(a, b){
  let c = createArray(a.length, b[0].length);
  for (let i = 0; i < c.length; i++){
    for (let j = 0; j < c[0].length; j++){
      let _c = 0
      for (let k = 0; k < b.length; k++){
        _c += a[i][k]*b[k][j];
      }
      c[i][j] = _c;
    }
  }
  return c;
}

class MatrixResult extends React.Component{
  constructor(props){
    super(props);
    this.state = {matrix: props.matrix};
  }

  componentWillReceiveProps(nextProps){
    this.setState({matrix: nextProps.matrix});
  }

  render() {
    const matrix = [];
    for (let i = 0; i < this.state.matrix.length; i++){
      const el = [];
      for (let j = 0; j < this.state.matrix[0].length; j++){
        el.push(
          <Text>
            {this.state.matrix[j][i]}
          </Text>
        )
      }
      matrix.push(
        <View
            style={{ width: "20%", flexDirection: "column" }}
            key={i}>
            {el}
        </View>
      )
    }
    console.log(this.state.matrix);
    return(
      <View style={{ flexDirection: "row", width:"10%"}}>
          {matrix}
      </View>
    )
  }
}

class MatrixPage extends React.Component {
  constructor(props){
    super(props)
    this.state =
    {
      matrixA: createArray(3,3),
      matrixB: createArray(3,3),
      matrixC: createArray(3,3),
      sum: true,
      mult: true
    }
    this.setMatrixA = this.setMatrixA.bind(this)
    this.setMatrixB = this.setMatrixB.bind(this)
    //this.checkAvailability = this.checkAvailability.bind(this);

  }

  setMatrixA(matrix){
    this.setState({matrixA: matrix})
    //this.checkAvailability();
  }

  setMatrixB(matrix){
    this.setState({matrixB: matrix})
    //this.checkAvailability();
  }

  onPressSum(){
    let result = matrix_sum(this.state.matrixA, this.state.matrixB);
    this.setState({matrixC: result})
    //console.log(result);
  }

  onPressSubstract(){
    let result = matrix_substract(this.state.matrixA, this.state.matrixB);
    this.setState({matrixC: result})
    //console.log(result);
  }

  onPressMult(){
    let result = matrix_mult(this.state.matrixA, this.state.matrixB);
    this.setState({matrixC: result})
    //console.log(result);
  }
  /*
  checkAvailability(){
    console.log(this.state);
    if (this.state.matrixA.length == this.state.matrixB.length &&
        this.state.matrixA[0].length == this.state.matrixB[0].length){
          this.setState({sum: true});
        }
    else{
      this.setState({sum:false});
    }
  }
  */

  render(){
    return(
      <View style={{flexDirection:"column"}}>
        <Matrix m={3} n={3} parentSender={this.setMatrixA}/>
        <Matrix m={3} n={3} parentSender={this.setMatrixB}/>
        <View style={{ flexDirection: "row", width: "40%" }}>
          <View style={{ flex: 0.2, margin: "0.5%" }}>
            <Button
              title="+"
              color='#014A11'
              disabled={!this.state.sum}
              onPress={() => this.onPressSum()}
            />
          </View>
          <View style={{ flex: 0.2, margin: "0.5%" }}>
            <Button
              title="-"
              color='#385A01'
              disabled={!this.state.sum}
              onPress={() => this.onPressSubstract()}
            />
          </View>
          <View style={{ flex: 0.2, margin: "0.5%" }}>
            <Button
              title="*"
              color='#97E815'
              disabled={!this.state.mult}
              onPress={() => this.onPressMult()}
            />
          </View>
        </View>
        <View>
          <MatrixResult matrix={this.state.matrixC}/>
        </View>
      </View>
    )
  }
}


export default function App() {
    return (
        <Container>
          <MatrixPage/>
        </Container>
    )
}
