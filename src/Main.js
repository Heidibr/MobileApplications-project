import React from 'react';
import {
	StyleSheet,
	View,
	StatusBar,
	ActivityIndicator,
	ScrollView,
	AsyncStorage, 
	TouchableHighlight, 
	Text
} from 'react-native';
import uuid from 'uuid/v1';
import {Header} from 'react-native-elements';
import SubTitle from './components/SubTitle';
import Input from './components/Input';
import List from './components/List';
import Button from './components/Button';


const headerTitle = 'Todo';

export default class Main extends React.Component {
	state = {
		inputValue: '',
		loadingItems: false,
		allItems: {},
		isCompleted: false
	};

	componentDidMount = () => {
		this.loadingItems();
	};

	newInputValue = value => {
		this.setState({
			inputValue: value
		});
	};

	loadingItems = async () => {
		try {
			const allItems = await AsyncStorage.getItem('Todos');
			this.setState({
				loadingItems: true,
				allItems: JSON.parse(allItems) || {}
			});
		} catch (err) {
			console.log(err);
		}
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
			await AsyncStorage.removeItem('Todos');
			this.setState({ allItems: {} });
		} catch (err) {
			console.log(err);
		}
	};

	saveItems = newItem => {
		const saveItem = AsyncStorage.setItem('Todos', JSON.stringify(newItem));
	};

	//Fikse så denne fatsik logger personen ut, og ikke bare går til login siden
	signOut = () => {
		this.props.navigation.navigate('Login')
	}

	render() {
		const { inputValue, loadingItems, allItems } = this.state;

		return (
			<View style={styles.view}>
				<StatusBar barStyle="light-content" />
				<View style={styles.centered}>
					<Header title={headerTitle} 
					rightComponent={
						<TouchableHighlight onPress={this.signOut}>
						  <Text style={{textDecorationLine: 'underline', color: 'grey'}}>Sign Out</Text>
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