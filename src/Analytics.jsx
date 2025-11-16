import {
    Box,
    VStack,
    Heading,
    Text,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    Progress
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { API_URL } from './App';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/golf/analytics`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
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
                <Text mt={4}>Loading analytics...</Text>
            </Box>
        );
    }

    if (!analytics?.hasData) {
        return (
            <Box maxW="1200px" mx="auto" p={6}>
                <VStack spacing={6}>
                    <Heading size="lg">Performance Analytics</Heading>
                    <Box bg="white" p={8} borderRadius="lg" textAlign="center">
                        <Text color="gray.500">
                            No data available yet. Start recording shots to see your analytics!
                        </Text>
                    </Box>
                </VStack>
            </Box>
        );
    }

    const sortedClubRecommendations = Object.entries(analytics.clubRecommendations || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const sortedClubsUsed = Object.entries(analytics.clubsUsed || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const sortedShotsByLie = Object.entries(analytics.shotsByLie || {}).sort(
        ([, a], [, b]) => b - a
    );

    return (
        <Box maxW="1200px" mx="auto" p={6}>
            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading size="lg">Performance Analytics</Heading>
                    <Text color="gray.600">Analyze your game and track improvement</Text>
                </Box>

                {/* Overview Stats */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                        <Stat>
                            <StatLabel>Total Shots</StatLabel>
                            <StatNumber>{analytics.totalShots}</StatNumber>
                            <StatHelpText>All time</StatHelpText>
                        </Stat>
                    </Box>

                    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                        <Stat>
                            <StatLabel>Recent Activity</StatLabel>
                            <StatNumber>{analytics.recentShots}</StatNumber>
                            <StatHelpText>Last 7 days</StatHelpText>
                        </Stat>
                    </Box>

                    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                        <Stat>
                            <StatLabel>Unique Lies</StatLabel>
                            <StatNumber>{Object.keys(analytics.shotsByLie).length}</StatNumber>
                            <StatHelpText>Different conditions</StatHelpText>
                        </Stat>
                    </Box>
                </SimpleGrid>

                {/* Shots by Lie Type */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                    <Heading size="md" mb={4}>
                        Shots by Lie Type
                    </Heading>
                    <VStack spacing={3} align="stretch">
                        {sortedShotsByLie.map(([lie, count]) => (
                            <Box key={lie}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Box>
                                        <Badge colorScheme={getLieBadgeColor(lie)} mr={2}>
                                            {lie}
                                        </Badge>
                                        <Text as="span" fontSize="sm" color="gray.600">
                                            {count} shots
                                        </Text>
                                    </Box>
                                    <Text fontSize="sm" fontWeight="bold">
                                        {Math.round((count / analytics.totalShots) * 100)}%
                                    </Text>
                                </Box>
                                <Progress
                                    value={(count / analytics.totalShots) * 100}
                                    colorScheme={getLieBadgeColor(lie)}
                                    size="sm"
                                    borderRadius="full"
                                />
                            </Box>
                        ))}
                    </VStack>
                </Box>

                {/* Average Distance by Lie */}
                {Object.keys(analytics.avgDistanceByLie).length > 0 && (
                    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                        <Heading size="md" mb={4}>
                            Average Distance by Lie
                        </Heading>
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Lie Type</Th>
                                    <Th isNumeric>Avg Distance</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {Object.entries(analytics.avgDistanceByLie)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([lie, distance]) => (
                                        <Tr key={lie}>
                                            <Td>
                                                <Badge colorScheme={getLieBadgeColor(lie)}>
                                                    {lie}
                                                </Badge>
                                            </Td>
                                            <Td isNumeric fontWeight="bold">
                                                {distance} yards
                                            </Td>
                                        </Tr>
                                    ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* AI Club Recommendations */}
                    {sortedClubRecommendations.length > 0 && (
                        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                            <Heading size="md" mb={4}>
                                Most Recommended Clubs (AI)
                            </Heading>
                            <VStack spacing={2} align="stretch">
                                {sortedClubRecommendations.map(([club, count]) => (
                                    <Box
                                        key={club}
                                        display="flex"
                                        justifyContent="space-between"
                                        p={2}
                                        borderRadius="md"
                                        bg="gray.50"
                                    >
                                        <Text fontWeight="medium">{club}</Text>
                                        <Badge colorScheme="blue">{count} times</Badge>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>
                    )}

                    {/* Clubs Actually Used */}
                    {sortedClubsUsed.length > 0 && (
                        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                            <Heading size="md" mb={4}>
                                Most Used Clubs (Actual)
                            </Heading>
                            <VStack spacing={2} align="stretch">
                                {sortedClubsUsed.map(([club, count]) => (
                                    <Box
                                        key={club}
                                        display="flex"
                                        justifyContent="space-between"
                                        p={2}
                                        borderRadius="md"
                                        bg="gray.50"
                                    >
                                        <Text fontWeight="medium">{club}</Text>
                                        <Badge colorScheme="green">{count} times</Badge>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>
                    )}
                </SimpleGrid>
            </VStack>
        </Box>
    );
};

export default Analytics;
