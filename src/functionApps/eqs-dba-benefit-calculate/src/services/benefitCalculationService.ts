import { CamundaService } from './camundaService';
import { mapToMemberData, mapToSubProcessData } from '../utils/mappers';
import { 
    StartProcessRequest, 
    ProcessResponse, 
    CompleteTaskRequest, 
    FinalResultResponse,
    MemberData,
    SubProcessData, 
    RequiredField
} from '../models/types';
import { AutoLog } from '../utils/logger';

@AutoLog
export class BenefitCalculationService {
    private camundaService: CamundaService;

    constructor() {
        this.camundaService = new CamundaService();
    }

    /**
     * Starts a new benefit calculation process
     */
    async startBenefitCalculation(request: StartProcessRequest): Promise<ProcessResponse> {
        const processInstanceId = await this.camundaService.startProcess(request);
        const taskId = await this.camundaService.getTaskId(processInstanceId);
        const requiredFields = await this.camundaService.getRequiredFields(taskId, processInstanceId);

        return {
            processInstanceId,
            taskId,
            requiredFields
        };
    }

    /**
     * Retrieves task details for a process instance
     */
    async getTaskDetails(processInstanceId: string): Promise<{ taskId: string; requiredFields: RequiredField[] }> {
        const taskId = await this.camundaService.getTaskId(processInstanceId);
        const requiredFields = await this.camundaService.getRequiredFields(taskId, processInstanceId);

        return {
            taskId,
            requiredFields
        };
    }

    /**
     * Completes a task and returns final results
     */
    async completeTask(request: CompleteTaskRequest): Promise<FinalResultResponse> {
        const taskId = await this.camundaService.getTaskId(request.processInstanceId);
        await this.camundaService.completeTaskWithVariables(taskId, request.variables);
                
        return await this.getFinalResults(request.processInstanceId, taskId);
    }

    /**
     * Completes a task directly using task ID
     */
    async completeTaskDirect(taskId: string, requestBody: CompleteTaskRequest): Promise<{ success: boolean; message: string; taskId: string }> {
        await this.camundaService.completeTaskDirect(taskId, requestBody);
                
        return {
            success: true,
            message: 'Task completed successfully',
            taskId
        };
    }

    /**
     * Waits for subprocess completion with polling
     */
    private async waitForSubProcessCompletion(subProcessInstanceId: string, maxWaitTime: number = 10000): Promise<boolean> {
        const startTime = Date.now();
        let pollInterval = 100;
        let attemptCount = 0;

        while (Date.now() - startTime < maxWaitTime) {
            try {
                attemptCount++;
                const isCompleted = await this.camundaService.isProcessCompleted(subProcessInstanceId);
                if (isCompleted) {
                    console.log(`Subprocess ${subProcessInstanceId} completed successfully after ${attemptCount} attempts`);
                    return true;
                }
                
                // Increase poll interval after initial attempts
                if (attemptCount > 5) {
                    pollInterval = 500; 
                }
                
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            } catch (error: unknown) {
                const err = error as Error;
                console.log(`Error checking subprocess completion (attempt ${attemptCount}): ${err.message}`);
            }
        }

        console.log(`Subprocess ${subProcessInstanceId} did not complete within ${maxWaitTime}ms after ${attemptCount} attempts`);
        return false;
    }

    /**
     * Retrieves final results from main process and subprocess
     */
    async getFinalResults(processInstanceId: string, taskId: string | null): Promise<FinalResultResponse> {
        const response: FinalResultResponse = {
            message: 'Task completed successfully',
            processInstanceId,
            taskId,
            memberData: {} as MemberData,
            subProcessData: {} as SubProcessData
        };

        try {
            // Get main process variables
            const mainProcessVariables = await this.camundaService.getProcessVariables(processInstanceId);
            response.memberData = mapToMemberData(mainProcessVariables);

            try {
                const subProcessInstanceId = await this.camundaService.getSubProcessInstanceId(processInstanceId);
                if (subProcessInstanceId) {
                    console.log(`Found subprocess: ${subProcessInstanceId}, waiting for completion...`);
                    
                    const subProcessCompleted = await this.waitForSubProcessCompletion(subProcessInstanceId, 8000);
                    
                    if (subProcessCompleted) {
                        const subProcessVariables = await this.camundaService.getProcessVariables(subProcessInstanceId);
                        response.subProcessData = mapToSubProcessData(subProcessVariables);
                        console.log('Subprocess completed and variables fetched successfully');
                    } else {
                        // Fallback: attempt to get variables even if timeout occurred
                        try {
                            const subProcessVariables = await this.camundaService.getProcessVariables(subProcessInstanceId);
                            const mappedData = mapToSubProcessData(subProcessVariables);
                            
                            if (Object.keys(mappedData).length > 0) {
                                response.subProcessData = mappedData;
                                console.log('Subprocess variables retrieved despite timeout');
                            } else {
                                response.subProcessData = {} as SubProcessData;
                                console.log(`Subprocess ${subProcessInstanceId} timeout and no meaningful data found`);
                            }
                        } catch (fallbackError: unknown) {
                            const fallbackErr = fallbackError as Error;
                            console.log(`Failed to get subprocess ${subProcessInstanceId} variables after timeout:`, fallbackErr.message);
                            response.subProcessData = {} as SubProcessData;
                        }
                        response.message = `Task completed successfully ${taskId}, subprocess may still be processing`;
                    }
                } else {
                    console.log('No subprocess found');
                    response.subProcessData = {} as SubProcessData;
                }
            } catch (error: unknown) {
                const err = error as Error;
                console.log('No subprocess found or error fetching subprocess variables:', err.message);
                response.subProcessData = {} as SubProcessData;
            }

            return response;
        } catch (error: unknown) {
            const err = error as Error;
            throw new Error(`Failed to get final results: ${err.message}`);
        }
    }
}
