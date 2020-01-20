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
import * as Google from 'expo-google-app-auth';
import * as Calendar from 'expo-calendar';
import * as Permissions from 'expo-permissions';
import calend from '../src/components/screens/Calendar';

const headerTitle = 'Todo';

export default class Main extends React.Component {
	state = {
		inputValue: '',
		loadingItems: false,
		allItems: {},
		isCompleted: false, 
		currentUser: null,
		calendarCreated: false,
		calendarID: '',
		results:[]
	};

	componentWillMount = () => {
		var user = this.props.navigation.getParam('user', 'uid')
		this.setState({
			currentUser: user
		})
	}
	componentDidMount = () => {
		this.loadingItems();
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

	async myCalendar() {  

		const { status } = await Calendar.requestCalendarPermissionsAsync();
      	if (status === 'granted') {
			let iOsCalendarConfig = {
			title: 'Expo Calendar',
			color: 'blue',
			entityType: Calendar.EntityTypes.EVENT,
			name: 'internalCalendarName',
			ownerAccount: 'personal',
			accessLevel: Calendar.CalendarAccessLevel.OWNER,
			}
		
			const getEventsCalendars = () => {
			return Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
			}
		
			
			let osConfig;
		
			const calendars = await getEventsCalendars()
			const caldavCalendar = calendars.find(calendar => calendar.source.type == "caldav")
			osConfig = iOsCalendarConfig;
			// Sources can't be made up on iOS. We find the first one of type caldav (most common internet standard)
			//Dette er ID-en til kalenderen, så dette trenger man egentlig bare en gang også kan man bruke denne til å lage events tror ejg
			osConfig.sourceId = caldavCalendar.source.id
			osConfig.source = caldavCalendar.source
			console.log(osConfig.sourceId)
		
			Calendar.createCalendarAsync(osConfig)
			.then( event => {
				this.setState({ results: event });
			})
			.catch( error => {
				this.setState({ results: error });
			});
		  } else {
			  console.log("permisson not granted")
		  }
		
	  }

	  createEvent( )

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
						<TouchableHighlight onPress={async () => await this.myCalendar()}>
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