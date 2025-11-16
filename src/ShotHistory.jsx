import {
    Box,
    VStack,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    IconButton,
    useToast,
    Spinner
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { API_URL } from './App';

const ShotHistory = () => {
    const [shots, setShots] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchShots();
    }, []);

    const fetchShots = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/golf/shots`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setShots(data);
        } catch (error) {
            toast({
                title: 'Error loading shots',
                description: error.message,
                status: 'error',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteShot = async (id) => {
        try {
            await fetch(`${API_URL}/api/golf/shots/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setShots(shots.filter((shot) => shot._id !== id));
            toast({
                title: 'Shot deleted',
                status: 'success',
                duration: 2000
            });
        } catch (error) {
            toast({
                title: 'Error deleting shot',
                description: error.message,
                status: 'error',
                duration: 3000
            });
        }
    };

    const getLieBadgeColor = (lie) => {
        const colors = {
            tee: 'blue',
            fairway: 'green',
            rough: 'orange',
            sand: 'yellow',
            bunker: 'yellow',
            green: 'teal'
        };
        return colors[lie] || 'gray';
    };

    if (loading) {
        return (
            <Box maxW="1200px" mx="auto" p={6} textAlign="center">
                <Spinner size="xl" />
                <Text mt={4}>Loading shot history...</Text>
            </Box>
        );
    }

    return (
        <Box maxW="1200px" mx="auto" p={6}>
            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading size="lg">Shot History</Heading>
                    <Text color="gray.600">Review your past shots and AI recommendations</Text>
                </Box>

                {shots.length === 0 ? (
                    <Box bg="white" p={8} borderRadius="lg" textAlign="center">
                        <Text color="gray.500">
                            No shots recorded yet. Start using the shot recommendation tool to
                            build your history!
                        </Text>
                    </Box>
                ) : (
                    <Box bg="white" borderRadius="lg" boxShadow="sm" overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Date</Th>
                                    <Th isNumeric>Distance</Th>
                                    <Th>Lie</Th>
                                    <Th>AI Recommended</Th>
                                    <Th>Club Used</Th>
                                    <Th>Outcome</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {shots.map((shot) => (
                                    <Tr key={shot._id}>
                                        <Td>
                                            {new Date(shot.createdAt).toLocaleDateString()}
                                            <br />
                                            <Text fontSize="xs" color="gray.500">
                                                {new Date(shot.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Text>
                                        </Td>
                                        <Td isNumeric>{shot.distance} yds</Td>
                                        <Td>
                                            <Badge colorScheme={getLieBadgeColor(shot.lie)}>
                                                {shot.lie}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            {shot.aiRecommendation?.club || (
                                                <Text color="gray.400">-</Text>
                                            )}
                                        </Td>
                                        <Td>
                                            {shot.clubUsed || <Text color="gray.400">-</Text>}
                                        </Td>
                                        <Td>
                                            {shot.outcome || <Text color="gray.400">-</Text>}
                                        </Td>
                                        <Td>
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => deleteShot(shot._id)}
                                                aria-label="Delete shot"
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}

                <Box bg="blue.50" p={4} borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                        Total Shots: {shots.length}
                    </Text>
                    {shots.length > 0 && (
                        <Text fontSize="sm" color="gray.600">
                            Keep tracking your shots to analyze patterns and improve your game!
                        </Text>
                    )}
                </Box>
            </VStack>
        </Box>
    );
};

export default ShotHistory;
