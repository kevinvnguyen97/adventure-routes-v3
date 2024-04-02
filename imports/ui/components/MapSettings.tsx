import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Text,
} from "@chakra-ui/react";
import { humanReadableTravelMode, Color, MUTCDFont } from "/imports/constants";

type MapSettingsProps = {
  travelMode: google.maps.TravelMode;
  setTravelMode: (travelMode: google.maps.TravelMode) => void;
  isTrafficLayerVisible: boolean;
  setIsTrafficLayerVisible: () => void;
  isTransitLayerVisible: boolean;
  setIsTransitLayerVisible: () => void;
  isKmlLayerVisible: boolean;
  setIsKmlLayerVisible: () => void;
  isAvoidHighwaysEnabled: boolean;
  setIsAvoidHighwaysEnabled: () => void;
  isAvoidTollsEnabled: boolean;
  setIsAvoidTollsEnabled: () => void;
  unitSystem: google.maps.UnitSystem;
  setUnitSystem: (unitSystem: google.maps.UnitSystem) => void;
  mutcdFont: MUTCDFont;
  setMutcdFont: (mutcdFont: MUTCDFont) => void;
};
export const MapSettings = (props: MapSettingsProps) => {
  const {
    travelMode,
    setTravelMode,
    isTrafficLayerVisible,
    setIsTrafficLayerVisible,
    isTransitLayerVisible,
    setIsTransitLayerVisible,
    isKmlLayerVisible,
    setIsKmlLayerVisible,
    isAvoidHighwaysEnabled,
    setIsAvoidHighwaysEnabled,
    isAvoidTollsEnabled,
    setIsAvoidTollsEnabled,
    unitSystem,
    setUnitSystem,
    mutcdFont,
    setMutcdFont,
  } = props;
  return (
    <Box>
      <Select
        placeholder="Select Transportation Mode"
        bgColor={Color.WHITE}
        color={Color.BLACK}
        focusBorderColor="orange.400"
        errorBorderColor="red.500"
        value={travelMode}
        onChange={(e) =>
          setTravelMode(e.target.value as google.maps.TravelMode)
        }
      >
        {Object.keys(google.maps.TravelMode).map(
          (mode) =>
            mode !== "TWO_WHEELER" && (
              <option key={mode} value={mode}>
                {humanReadableTravelMode[mode as google.maps.TravelMode]}
              </option>
            )
        )}
      </Select>
      <FormControl
        width="100%"
        display="flex"
        justifyContent="space-between"
        color={Color.WHITE}
        paddingTop={3}
        paddingBottom={3}
      >
        <FormLabel htmlFor="traffic-layer-switch" fontWeight="bold">
          Traffic Layer
        </FormLabel>
        <Switch
          id="traffic-layer-switch"
          isChecked={isTrafficLayerVisible}
          onChange={setIsTrafficLayerVisible}
          colorScheme="orange"
        />
      </FormControl>
      <FormControl
        width="100%"
        display="flex"
        justifyContent="space-between"
        color={Color.WHITE}
        paddingBottom={3}
      >
        <FormLabel htmlFor="transit-layer-switch" fontWeight="bold">
          Transit Layer
        </FormLabel>
        <Switch
          id="transit-layer-switch"
          isChecked={isTransitLayerVisible}
          onChange={setIsTransitLayerVisible}
          colorScheme="orange"
        />
      </FormControl>
      <FormControl
        width="100%"
        display="flex"
        justifyContent="space-between"
        color={Color.WHITE}
        paddingBottom={3}
      >
        <FormLabel htmlFor="kml-layer-switch" fontWeight="bold">
          KML Layer
        </FormLabel>
        <Switch
          id="kml-layer-switch"
          isChecked={isKmlLayerVisible}
          onChange={setIsKmlLayerVisible}
          colorScheme="orange"
        />
      </FormControl>
      <FormControl
        width="100%"
        display="flex"
        justifyContent="space-between"
        color={Color.WHITE}
        paddingBottom={3}
      >
        <FormLabel htmlFor="avoid-highways-switch" fontWeight="bold">
          Avoid Highways
        </FormLabel>
        <Switch
          id="avoid-highways-switch"
          isChecked={isAvoidHighwaysEnabled}
          onChange={setIsAvoidHighwaysEnabled}
          colorScheme="orange"
        />
      </FormControl>
      <FormControl
        width="100%"
        display="flex"
        justifyContent="space-between"
        color={Color.WHITE}
        paddingBottom={3}
      >
        <FormLabel htmlFor="avoid-tolls-switch" fontWeight="bold">
          Avoid Tolls
        </FormLabel>
        <Switch
          id="avoid-tolls-switch"
          isChecked={isAvoidTollsEnabled}
          onChange={setIsAvoidTollsEnabled}
          colorScheme="orange"
        />
      </FormControl>
      <RadioGroup
        colorScheme="orange"
        value={unitSystem.toString()}
        onChange={(e) => setUnitSystem(parseInt(e))}
        paddingBottom={5}
      >
        <HStack justifyContent="space-between" color={Color.WHITE}>
          <Text fontWeight="bold">Unit of Measurement</Text>
          <Radio value="1">Imperial</Radio>
          <Radio value="0">Metric</Radio>
        </HStack>
      </RadioGroup>
      <RadioGroup
        colorScheme="orange"
        value={mutcdFont}
        onChange={(e) => setMutcdFont(e as MUTCDFont)}
      >
        <HStack justifyContent="space-between" color={Color.WHITE}>
          <Text fontWeight="bold">MUTCD Font</Text>
          <Radio value={MUTCDFont.HWYGOTHIC} fontFamily={MUTCDFont.HWYGOTHIC}>
            <Text
              fontFamily={MUTCDFont.HWYGOTHIC}
              letterSpacing={2}
              fontSize={18}
            >
              Highway Gothic
            </Text>
          </Radio>
          <Radio value={MUTCDFont.CLEARVIEW}>
            <Text
              fontFamily={MUTCDFont.CLEARVIEW}
              letterSpacing={0}
              fontWeight={500}
              fontSize={16}
            >
              Clearview
            </Text>
          </Radio>
        </HStack>
      </RadioGroup>
    </Box>
  );
};
