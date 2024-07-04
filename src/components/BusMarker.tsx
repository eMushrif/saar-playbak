// components/BusMarker.tsx
import React, { useMemo } from "react";
import { Stop, VehicleLog } from "../types";
import { ActionIcon, HoverCard, Text, Badge, Group, Stack } from '@mantine/core';
import { IconBus } from '@tabler/icons-react';
import { formatDateNicely } from "../utils/dateToString";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useTimespan } from "../hooks/useTimespan";

const BusMarker = ({ log }: { log: VehicleLog }) => {
  const time = useSelector((state: RootState) => state.select.time);

  return (
    <HoverCard shadow="md">
      <HoverCard.Target>
        <ActionIcon variant="filled" color="purple" size="lg">
          <IconBus size="1.2rem" />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Stack mt="xs">
          <Text size="xs">Speed: {log.speed}</Text>
          <Text size="xs">Heading: {log.heading}</Text>
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

export default BusMarker;
