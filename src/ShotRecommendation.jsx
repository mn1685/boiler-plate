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
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
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
                body: JSON.stringify({ distance, lie, obstacle })
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
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default ShotRecommendation;
