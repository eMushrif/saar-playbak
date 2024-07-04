// components/HomeMarker.tsx
import React, { useMemo } from "react";
import { Stop } from "../types";
import { ActionIcon, HoverCard, Text, Badge, Group, Table } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { formatDateNicely } from "../utils/dateToString";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useTimespan } from "../hooks/useTimespan";

const HomeMarker = ({ stops }: { stops: Stop[] }) => {
  const time = useSelector((state: RootState) => state.select.time);
  const timespan = useTimespan();

  if (!time || !timespan) return null;

  const currentTime = useMemo(() => time || timespan.start.getTime(), [time, timespan]);

  const markerColor = getMarkerColor(stops, currentTime);

  return (
    <HoverCard width={350} shadow="md">
      <HoverCard.Target>
        <ActionIcon variant="filled" color={markerColor} size="lg">
          <IconHome size="1.2rem" />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Table verticalSpacing="xs" horizontalSpacing="xs">
          <Table.Thead p={0} m={0}>
            <Table.Tr p={0} m={0}>
              <Table.Th p={0} m={0} pb={1}>Stop</Table.Th>
              <Table.Th p={0} m={0} pb={1}>Status</Table.Th>
              <Table.Th p={0} m={0} pb={1}>Pickup</Table.Th>
              <Table.Th p={0} m={0} pb={1}>Dropoff</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody p={0} m={0}>
          {stops.map((stop) => (
            <Table.Tr p={0} m={0} key={stop.id}>
              <Table.Td p={0} m={0} pb={1}><Text size="xs" >{stop.name}</Text></Table.Td>
              <Table.Td p={0} m={0} pb={1}>
                <Badge size="xs" color={getStatusColor(stop, currentTime)}>
                  {getStatusText(stop, currentTime)}
                </Badge>
              </Table.Td>
              <Table.Td p={0} m={0} pb={1}>
                {stop.actualPickupTime && stop.actualPickupTime.getTime() <= currentTime && (
                  <Text size="xs">{formatDateNicely(stop.actualPickupTime)}</Text>
                )}
              </Table.Td>
              <Table.Td p={0} m={0} pb={1}>
                {stop.actualDropoffTime && stop.actualDropoffTime.getTime() <= currentTime && (
                  <Text size="xs">{formatDateNicely(stop.actualDropoffTime)}</Text>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
          </Table.Tbody>
        </Table>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

const getMarkerColor = (stops: Stop[], currentTime: number): string => {
  if (stops.some(stop => stop.actualDropoffTime && stop.actualDropoffTime.getTime() <= currentTime)) return "green";
  if (stops.some(stop => stop.actualPickupTime && stop.actualPickupTime.getTime() <= currentTime)) return "orange";
  if (stops.some(stop => stop.noshowTime && stop.noshowTime.getTime() <= currentTime)) return "red";
  return "gray";
}

const getStatusColor = (stop: Stop, currentTime: number): string => {
  if (stop.actualDropoffTime && stop.actualDropoffTime.getTime() <= currentTime) return "green";
  if (stop.actualPickupTime && stop.actualPickupTime.getTime() <= currentTime) return "orange";
  if (stop.noshowTime && stop.noshowTime.getTime() <= currentTime) return "red";
  return "gray";
}

const getStatusText = (stop: Stop, currentTime: number): string => {
  if (stop.actualDropoffTime && stop.actualDropoffTime.getTime() <= currentTime) return "Dropoff";
  if (stop.actualPickupTime && stop.actualPickupTime.getTime() <= currentTime) return "Pickup";
  if (stop.noshowTime && stop.noshowTime.getTime() <= currentTime) return "No Show";
  return "Pending";
}

export default HomeMarker;
