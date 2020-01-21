import React, { useEffect } from 'react';
import {
	StyleSheet,
	View,
	StatusBar,
	ActivityIndicator,
	ScrollView,
	AsyncStorage, 
	TouchableHighlight, 
	Text,
	PermissionsAndroid,
	Platform
} from 'react-native';
import uuid from 'uuid/v1';
import {Header} from 'react-native-elements';
import '@firebase/firestore';

import SubTitle from './components/SubTitle';
import Input from './components/Input';
import List from './components/List';
import Button from './components/Button';
import firebase from 'firebase'
import * as Calendar from 'expo-calendar';
import * as Permissions from 'expo-permissions';

/*async function alertIfRemoteNotificationsDisabledAsync() {
	const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        alert("funker ikke")
  }
}*/
const headerTitle = 'Todo';

export default class Main extends React.Component {
	state = {
		inputValue: '',
		loadingItems: false,
		allItems: {},
		isCompleted: false, 
		currentUser: null,
		calendarCreated: false,
		calendarId: '',
		results:[]
	};

	componentWillMount = () => {
		var user = this.props.navigation.getParam('user', 'uid')
		this.setState({
			currentUser: user
		})
			firebase.database().ref('/users/'+ this.state.currentUser + '/calendar').once('value', (snap) => {
				let dataen = snap.val()
				if(dataen != null){
					this.setState({
						calendarCreated: dataen.calendarCreated,
					});
				}
			});
		
	}

	componentDidMount = () => {
		this.loadingItems();
		console.log(this.state.calendarCreated)
		
		if(this.state.calendarCreated){
			this.loadingCalendarItems(); 
		}
		console.log('componentdidmount', this.state.currentUser)
	}

	newInputValue = value => {
		this.setState({
			inputValue: value
		});
	};

	loadingItems = () => {
			firebase.database().ref('/users/'+ this.state.currentUser + '/todos/todo').once('value', (snap) => {
				console.log('etter tingen',snap.val())
				let dataen = snap.val()
				this.setState({
					loadingItems: true,
					allItems: {
						...dataen
					}
				});
			});
		};

	loadingCalendarItems = () => {
			firebase.database().ref('/users/'+ this.state.currentUser + '/calendar').once('value', (snap) => {
				let dataen = snap.val()
					this.setState({
						calendarId: dataen.calendarId
					});
			});
		};

	onDoneAddItem = () => {
		const { inputValue } = this.state;
		if (inputValue !== '') {
			this.setState(prevState => {
				const id = uuid();
				const newItemObject = {
					[id]: {
						id,
						isCompleted: false,
						text: inputValue,
						createdAt: Date.now()
					}
				};
				const newState = {
					...prevState,
					inputValue: '',
					allItems: {
						...prevState.allItems,
						...newItemObject
					}
				};
				this.saveItems(newState.allItems);
				return { ...newState };
			}); 
		}
	};

	deleteItem = id => {
		this.setState(prevState => {
			const allItems = prevState.allItems;
			delete allItems[id];
			const newState = {
				...prevState,
				...allItems
			};
			this.saveItems(newState.allItems);
			return { ...newState };
		});
	};

	completeItem = id => {
		this.setState(prevState => {
			const newState = {
				...prevState,
				allItems: {
					...prevState.allItems,
					[id]: {
						...prevState.allItems[id],
						isCompleted: true
					}
				}
			};
			this.saveItems(newState.allItems);
			return { ...newState };
		});
	};

	incompleteItem = id => {
		this.setState(prevState => {
			const newState = {
				...prevState,
				allItems: {
					...prevState.allItems,
					[id]: {
						...prevState.allItems[id],
						isCompleted: false
					}
				}
			};
			this.saveItems(newState.allItems);
			return { ...newState };
		});
	};

	deleteAllItems = async () => {
		try {
			await firebase.database().ref('/users/'+ this.state.currentUser + '/todos').remove()
			this.setState({ allItems: {} });
		} catch (err) {
			console.log(err);
		}
	};

	saveItems = newItem => {
		firebase.database().ref('/users/'+ this.state.currentUser + '/todos').set({
			todo: newItem
		})
	};

	signOut = async () => {
		try{
			firebase.auth().signOut().then(() => {
				this.props.navigation.navigate('Login');
			}, function (error){
				console.log("Error while logging out: " + error);
			});
		}
		catch(error){
			console.log('NOE GIKK GALT: '+ error)
		}
	}

///////////////////////// Code for communicating with the calendar\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	

	saveCalendarToDb = (created, id) => {
		firebase.database().ref('/users/'+ this.state.currentUser + '/calendar').set({
			calendarCreated: created,
			calendarId: id
		});
	};

	async addToDoToCalender() {
		if(!this.state.calendarCreated){
			this.createCalendar();
			
		}
		const { status } = await Permissions.askAsync(Permissions.CALENDAR);
		if (status === 'granted') {
			event = {
				title: 'lage Pizza',
				startDate: new Date("2020-01-22T17:30:00Z"),
				endDate: new Date("2020-01-22T18:30:00Z")
			}	
		  	let result = await Calendar.createEventAsync(this.state.calendarId, event);
		  	console.log(result);
		}	
		/*const event = {};
		/* event.set('title',"lage pizza")
		event.set('startDate', new Date("2020-01-23 10:30:00"));
		event.set('endDate', new Date("2020-01-23 12:30:00"));
		console.log('the calendarid is:', this.state.calendarID)
		Calendar.createEventAsync(this.state.calendarID, event)
    	console.log('event som skal lages', event)
		const events = Calendar.getEventsAsync([this.calendarID], "2020-01-19T17:26:11.446Z", "2021-01-19T17:26:11.446Z")
		console.log('events',events)*/
	}

	getEventsCalendars = () => {
		return Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
	}

	async createCalendar() {
		const { status } = await Permissions.askAsync(Permissions.CALENDAR);
		if (status !== 'granted') {
		  	console.warn('NOT GRANTED');
		  	alert("no calendar premission")
		  	return;
		}	
		let iOsCalendarConfig = {
			title: 'ny kalender',
			color: 'blue',
			entityType: Calendar.EntityTypes.EVENT,
		 	name: 'internalCalendarName',
			ownerAccount: 'personal',
		    accessLevel: Calendar.CalendarAccessLevel.ROOT,
		}
		const calendars = await this.getEventsCalendars();
		const caldavCalendar = calendars.find(calendar => calendar.source.type == "caldav");
		let osConfig;
		osConfig = iOsCalendarConfig;
		osConfig.sourceId = caldavCalendar.source.id;
		osConfig.source = caldavCalendar.source;
		Calendar.createCalendarAsync(osConfig)
		   .then( event => {
			console.log(event)
			this.setState({ calendarId: event });
			this.setState({ calendarCreated: true })
			this.saveCalendarToDb(true, event)
			})
		  	.catch( error => {
				console.log("Error while trying to create calendar: "+error)
  			});
		console.log("calendar created")
		console.log(`The new calendar id is: ${this.calendarId}`)
		
 	}
	  
	render() {
		const { inputValue, loadingItems, allItems } = this.state;
		console.log('state i render', allItems)
		return (
			<View style={styles.view}>
				<StatusBar barStyle="light-content" />
				<View style={styles.centered}>
				<Header title={headerTitle} 
					rightComponent={
						<TouchableHighlight onPress={this.signOut}>
						  <Text style={{textDecorationLine: 'underline', color: 'green'}}>Sign Out</Text>
						</TouchableHighlight>}
						containerStyle={{
							backgroundColor: '#D3D3D3',
							justifyContent: 'space-around'}}
					leftComponent={
						<TouchableHighlight onPress={async () => await this.addToDoToCalender()}>
						  <Text style={{textDecorationLine: 'underline', color: 'pink'}}>Calendar</Text>
						</TouchableHighlight>}
						containerStyle={{
							backgroundColor: '#D3D3D3',
							justifyContent: 'space-around'}}/>
				</View>
				<View style={styles.inputContainer}>
					<SubTitle subtitle={"What's Next?"} />
					<Input
						inputValue={inputValue}
						onChangeText={this.newInputValue}
						onDoneAddItem={this.onDoneAddItem}
					/>
				</View>
				<View style={styles.list}>
					<View style={styles.column}>
						<SubTitle subtitle={'Recent Notes'} />
						<View style={styles.deleteAllButton}>
							<Button deleteAllItems={this.deleteAllItems} />
						</View>
					</View>

					{loadingItems ? (
						<ScrollView contentContainerStyle={styles.scrollableList}>
							{Object.values(allItems)
								.reverse()
								.map(item => (
									<List
										key={item.id}
										{...item}
										deleteItem={this.deleteItem}
										completeItem={this.completeItem}
										incompleteItem={this.incompleteItem}
									/>
								))}
						</ScrollView>
					) : (
						<ActivityIndicator size="large" color="white" />
					)}
				</View>
				</View>
		);
	}
}
const styles = StyleSheet.create({
	view: {
		backgroundColor: '#D3D3D3',
		width: '100%', 
		height: '100%'
	},
	container: {
		flex: 1
	},
	centered: {
		alignItems: 'center'
	},
	inputContainer: {
		marginTop: 40,
		paddingLeft: 15
	},
	list: {
		flex: 1,
		marginTop: 70,
		paddingLeft: 15,
		marginBottom: 10
	},
	scrollableList: {
		marginTop: 15
	},
	column: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	deleteAllButton: {
		marginRight: 40
	}
});