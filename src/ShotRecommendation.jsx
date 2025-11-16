import {
    Box,
    VStack,
    Heading,
    Text,
    Badge,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { API_URL } from './App';

const ShotRecommendation = () => {
    const [distance, setDistance] = useState('');
    const [lie, setLie] = useState('fairway');
    const [obstacle, setObstacle] = useState('');
    const [location, setLocation] = useState('');
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [clubUsed, setClubUsed] = useState('');
    const [outcome, setOutcome] = useState('');
    const toast = useToast();

    const getRecommendation = async () => {
        if (!distance) {
            toast({
                title: 'Please enter distance',
                status: 'warning',
                duration: 3000
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/golf/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ distance, lie, obstacle, location })
            });
            const data = await response.json();
            setRecommendation(data);
        } catch (error) {
            toast({
                title: 'Error getting recommendation',
                description: error.message,
                status: 'error',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const saveShot = async () => {
        setSaving(true);
        try {
            await fetch(`${API_URL}/api/golf/shots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    distance: parseInt(distance),
                    lie,
                    obstacle,
                    aiRecommendation: {
                        club: recommendation.club,
                        strategy: recommendation.strategy,
                        reasoning: recommendation.reasoning
                    },
                    clubUsed,
                    outcome,
                    weather: recommendation.weather || undefined
                })
            });

            toast({
                title: 'Shot saved!',
                status: 'success',
                duration: 3000
            });

            // Reset form
            setDistance('');
            setObstacle('');
            setLocation('');
            setRecommendation(null);
            setClubUsed('');
            setOutcome('');
        } catch (error) {
            toast({
                title: 'Error saving shot',
                description: error.message,
                status: 'error',
                duration: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box maxW="700px" mx="auto" p={6}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">AI Golf Caddie</Heading>
                <Text color="gray.600">
                    Describe your shot and get AI-powered club and strategy recommendations
                </Text>

                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Distance to Target (yards)</FormLabel>
                            <Input
                                type="number"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder="150"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Current Lie</FormLabel>
                            <Select value={lie} onChange={(e) => setLie(e.target.value)}>
                                <option value="tee">Tee</option>
                                <option value="fairway">Fairway</option>
                                <option value="rough">Rough</option>
                                <option value="sand">Sand</option>
                                <option value="bunker">Bunker</option>
                                <option value="green">Green</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Obstacles/Hazards (optional)</FormLabel>
                            <Textarea
                                value={obstacle}
                                onChange={(e) => setObstacle(e.target.value)}
                                placeholder="Water 20 yards in front, trees on left..."
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Location (optional)</FormLabel>
                            <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, State or Zip Code"
                            />
                            <Text fontSize="xs" color="gray.500" mt={1}>
                                Add location to factor in real-time weather and wind conditions
                            </Text>
                        </FormControl>

                        <Button
                            colorScheme="blue"
                            w="full"
                            onClick={getRecommendation}
                            isLoading={loading}
                        >
                            Get AI Recommendation
                        </Button>
                    </VStack>
                </Box>

                {recommendation && (
                    <Box borderWidth="1px" borderRadius="lg" p={6} bg="white" boxShadow="md">
                        <VStack align="stretch" spacing={4}>
                            {recommendation.weather && (
                                <Box bg="blue.50" p={4} borderRadius="md" mb={2}>
                                    <Text fontWeight="bold" mb={2} fontSize="sm">
                                        Weather Conditions - {recommendation.weather.location}
                                    </Text>
                                    <VStack align="stretch" spacing={1} fontSize="sm">
                                        <Text>
                                            🌡️ {recommendation.weather.temperature}°F (feels like{' '}
                                            {recommendation.weather.feelsLike}°F)
                                        </Text>
                                        <Text>
                                            💨 Wind: {recommendation.weather.windSpeed} mph from{' '}
                                            {recommendation.weather.windDirection}
                                            {recommendation.weather.windGust &&
                                                ` (gusts ${recommendation.weather.windGust} mph)`}
                                        </Text>
                                        <Text>☁️ {recommendation.weather.description}</Text>
                                        <Text>💧 Humidity: {recommendation.weather.humidity}%</Text>
                                    </VStack>
                                </Box>
                            )}

                            <Box>
                                <Text fontSize="sm" color="gray.600" mb={1}>
                                    Recommended Club
                                </Text>
                                <Badge colorScheme="green" fontSize="2xl" p={2}>
                                    {recommendation.club}
                                </Badge>
                            </Box>

                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Strategy:
                                </Text>
                                <Text>{recommendation.strategy}</Text>
                            </Box>

                            <Box bg="blue.50" p={4} borderRadius="md">
                                <Text fontWeight="bold" mb={2}>
                                    AI Analysis:
                                </Text>
                                <Text fontSize="sm">{recommendation.reasoning}</Text>
                            </Box>

                            <Box borderTop="1px" borderColor="gray.200" pt={4}>
                                <Text fontWeight="bold" mb={3}>
                                    Record Your Shot (Optional)
                                </Text>
                                <VStack spacing={3}>
                                    <FormControl>
                                        <FormLabel fontSize="sm">Club Actually Used</FormLabel>
                                        <Input
                                            value={clubUsed}
                                            onChange={(e) => setClubUsed(e.target.value)}
                                            placeholder="e.g., 7-Iron"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel fontSize="sm">Outcome</FormLabel>
                                        <Textarea
                                            value={outcome}
                                            onChange={(e) => setOutcome(e.target.value)}
                                            placeholder="e.g., Hit green, 15 feet from pin"
                                            rows={2}
                                        />
                                    </FormControl>

                                    <Button
                                        colorScheme="green"
                                        w="full"
                                        onClick={saveShot}
                                        isLoading={saving}
                                    >
                                        Save to History
                                    </Button>
                                </VStack>
                            </Box>
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default ShotRecommendation;
