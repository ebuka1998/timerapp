import React, {Component} from 'react'
import { StyleSheet, Text, View,
  ScrollView,TouchableOpacity } from 'react-native'
import moment from 'moment'

// COMPONENTS LATER I PUT IN DIFFERENT PLACESBUT FOR LEARNING PURPOSES I SITCK TO HERE


function Timer ({interval, style}) {
  const pad = (n) => n < 10 ? '0' + n : n
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds()/10)
  return (
    <Text style = {style}>
      {pad(duration.minutes())}:
       {pad(duration.seconds())},
       {pad(centiseconds)}
    </Text>
  )
}


function RoundButton({title, color, background, onPress, disabled}) {
  return(
    <TouchableOpacity 
    onPress = {() => !disabled && onPress()}
    style={[styles.button, {backgroundColor: background}]}
    activeOpacity={disabled ? 1.0 : 0.7}
    >
      <View style={styles.buttonBorder}>
       <Text style={[styles.buttonTitle, {color}]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}


function ButtonRow({children}) {
  return (
    <View style={styles.buttonsRow}>{children}</View>
  )
}

function Lap({number, interval, fastest, slowest}) {
  
  const lapStyle = [
    styles.lapText,
    fastest && styles.fastest,
    slowest && styles.slowest
  ]
  return(
    <View style={styles.lap}>
      <Text style={lapStyle}>lap {number}</Text>
      <Timer style={lapStyle} interval={interval} />
    </View>
  )
}

function LapsTable({laps, timer}) {
  const finishedLaps = laps.slice(1)
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  if(finishedLaps.length >= 2) {
      finishedLaps.forEach(lap => {
        if(lap < min) min = lap
        if(lap > max) max = lap

      })
  }
  return(
      <ScrollView style= {styles.scrollView}>
      {laps.map((lap, index) =>  (
        <Lap number={laps.length - index} 
         key={laps.length - index}
          interval={index === 0 ? timer + lap : lap} 
          fastest={lap === min}
          slowest={lap === max}
         
         />
      )) }
      </ScrollView>
  
  )
}



























 
 
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
        start: 0,
        now: 0,
        laps: []
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  start = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
      laps: [0],
    })

    this.timer = setInterval(() => {
      this.setState({
        now: new Date().getTime()
      })
    }, 100)
  }

  lap = () => {
    const timeStamp = new Date().getTime()
    const {laps, now, start} = this.state
    const [firstLap, ...other] = laps
    this.setState({
      laps: [0, firstLap + now - start, ...other],
      start: timeStamp,
      now: timeStamp
    }) 
  }

  stop = () => {
    clearInterval(this.timer)
    const {laps, now, start} = this.state
    const [firstLap, ...other] = laps
    this.setState({
      laps: [firstLap + now - start, ...other],
      start: 0,
      now: 0
    }) 
  }

  reset = () => {
    this.setState({
      laps: [],
      start: 0,
      now: 0
    })
  }

  resume = () => {
    const now = new Date().getTime()
    this.setState ({
      start: now,
      now
    })

    this.timer = setInterval(() => {
      this.setState({
        now: new Date().getTime()
      })
    }, 100)
  }


  render() {
    const {now, start, laps} = this.state
    const timer = now - start
    return (
      <View style={styles.container}>
        <Timer 
        interval={laps.reduce((total, curr) => total + curr, 0) + timer} style={styles.timer}/>
        {laps.length === 0 && (
          <ButtonRow>
            <RoundButton title="Lap"
            color= "#8B8B90" background="#151515" disabled/>

            <RoundButton title="start" color= "#50D167" 
            background="#1B361F"
            onPress = {this.start}
            />
          </ButtonRow>

        )}

        {start > 0 && (
          <ButtonRow>
            <RoundButton title="Lap"
             color= "#FFF"
             onPress = {this.lap}
              background="#3D3D3D"/>
            <RoundButton title="stop" color= "#E33935" 
            background="#3C1715"
            onPress = {this.stop}
            />
          </ButtonRow>
        )}


      {laps.length > 0 && start === 0 && (
          <ButtonRow>
            <RoundButton title="Reset"
             color= "#FFF"
             onPress = {this.reset}
              background="#3D3D3D"/>
            <RoundButton title="start" color= "#50D167" 
            background="#1B361F"
            onPress = {this.resume}
            />
          </ButtonRow>
        )}
        
        <LapsTable laps={laps} timer = {timer}/>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 130,
    paddingHorizontal: 20
  },

  timer: {
    color: '#FFF',
    fontSize: 70,
    fontWeight: '200'
  },

  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center' 
  },

  buttonTitle: {
    fontSize: 20
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: 80,
    marginBottom: 30
  },

  lapText: {
    color: '#FFF',
    fontSize: 18,
  },

  lap: {
    flexDirection: 'row',
    justifyContent: "space-between",
    borderColor: '#151515',
    borderTopWidth: 1,
    paddingVertical: 10

  },

  scrollView: {
    alignSelf: 'stretch'
  },

  fastest: {
    color: '#4BC05F'
  },

  slowest: {
    color: '#CC3533'
  }
});
