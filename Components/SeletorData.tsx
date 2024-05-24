import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

interface SeletorDataProps {
  onDateChange: (newDate: Date) => void;
  dataMinima?: Date;
  dataMaxima?: Date;
}

const SeletorData: React.FC<SeletorDataProps> = ({ onDateChange, dataMinima, dataMaxima }) => {
  const [date, setDate] = useState(new Date());
  const [datePicked, setDatePicked] = useState(false);
  const [show, setShow] = useState(false);

  const onChange = (evento: DateTimePickerEvent, dataSelecionada?: Date | undefined) => {
    if (evento.type === "set" && dataSelecionada) {
      setShow(false);
      const currentDate = dataSelecionada || date;
      setDate(currentDate); 
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
            value={date}
            is24Hour={true}
            mode="date"
            display="default"
            onChange={onChange}
            minimumDate={dataMinima}
            maximumDate={dataMaxima}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 40,
    marginVertical: 10,
    backgroundColor: "#2a2a2a",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SeletorData;
