import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Button, View, StyleSheet, TouchableOpacity, Image } from "react-native";

interface SeletorDataProps {
  onDateChange: (newDate: Date) => void;
}

const SeletorData: React.FC<SeletorDataProps> = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date());
  const [datePicked, setDatePicked] = useState(false);
  const [show, setShow] = useState(false);

  const onChange = (evento: DateTimePickerEvent, dataSelecionada?: Date | undefined) => {
    if (evento.type === "set" && dataSelecionada) {
      const currentDate = dataSelecionada || date;
      setDate(currentDate);
      setShow(false);
      console.log(dataSelecionada.toLocaleDateString("pt-br"));
      setDatePicked(true);
      onDateChange(currentDate);
    } else if (evento.type === "dismissed") {
      setShow(false);
    }
  };

  return (
    <TouchableOpacity onPress={() => setShow(true)}>
      <View style={styles.container}>
        <Image
          source={
            !datePicked
              ? require("../assets/calendar.png")
              : require("../assets/calendarActive.png")
          }
        />
        {show && (
          <RNDateTimePicker
            testID="dateTimePicker"
            value={date}
            is24Hour={true}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 42,
    backgroundColor: "#2a2a2a",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SeletorData;
