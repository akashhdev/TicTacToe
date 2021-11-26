import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View, ImageBackground, Pressable, Alert } from "react-native";
import styles from "./screens/gameScreen/styles";
import bg from "./assets/bg.jpeg";

const emptyMap = [
  ["", "", ""], // 1st row
  ["", "", ""], // 2nd row
  ["", "", ""], // 3rd row
];

export default function gameScreen() {
  const [map, setMap] = useState(emptyMap);

  const [currentTurn, setCurrentTurn] = useState("x");

  const onPress = (rowIndex, columnIndex) => {
    if (map[rowIndex][columnIndex] !== "") {
      Alert.alert("Position already occupied");
    }
    setMap((existingMap) => {
      const updatedArray = [...existingMap];
      updatedArray[rowIndex][columnIndex] = currentTurn;
      return updatedArray;
    });
    setCurrentTurn(currentTurn === "x" ? "o" : "x");
    const winner = getWinner();
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  };

  const checkTieState = () => {
    if (!map.some((row) => row.some((ceil) => ceil === ""))) {
      Alert.alert(`Ooohh`, `It's a tie`, [
        {
          text: "Restart",
          onPress: resetGame,
        },
      ]);
    }
  };

  const getWinner = () => {
    // check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = map[i].every((cell) => cell === "x");
      const isRowOWinning = map[i].every((cell) => cell === "o");

      if (isRowXWinning) {
        return "x";
      }
      if (isRowOWinning) {
        return "o";
      }
    }

    // check columns
    for (let col = 0; col < 3; col++) {
      let isColumnXWinning = true;
      let isColumnOWinning = true;

      for (let row = 0; row < 3; row++) {
        if (map[row][col] !== "x") {
          isColumnXWinning = false;
        }
        if (map[row][col] !== "o") {
          isColumnOWinning = false;
        }
      }

      if (isColumnXWinning) {
        return "x";
        break;
      }
      if (isColumnOWinning) {
        return "o";
        break;
      }
    }

    // check diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;

    for (let i = 0; i < 3; i++) {
      if (map[i][i] !== "o") {
        isDiagonal1OWinning = false;
      }
      if (map[i][i] !== "x") {
        isDiagonal1XWinning = false;
      }

      if (map[i][2 - i] !== "o") {
        isDiagonal2OWinning = false;
      }
      if (map[i][2 - i] !== "x") {
        isDiagonal2XWinning = false;
      }
    }

    if (isDiagonal1XWinning || isDiagonal2XWinning) {
      return "x";
    }
    if (isDiagonal1OWinning || isDiagonal2OWinning) {
      return "o";
    }
  };

  const gameWon = (player) => {
    Alert.alert(`Huraaay`, `Player ${player} won`, [
      {
        text: "Restart",
        onPress: resetGame,
      },
    ]);
  };

  const resetGame = () => {
    setMap([
      ["", "", ""], // 1st row
      ["", "", ""], // 2nd row
      ["", "", ""], // 3rd row
    ]);
    setCurrentTurn("x");
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Pressable
                  key={`row-${rowIndex}-col-${columnIndex}`}
                  onPress={() => onPress(rowIndex, columnIndex)}
                  style={styles.cell}
                >
                  {cell == "o" && <View style={styles.circle} />}
                  {cell == "x" && (
                    <View style={styles.cross}>
                      <View style={styles.crossline} />
                      <View
                        style={[styles.crossline, styles.crosslineReversed]}
                      />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}
