const api = require('@novigi/api');
import { CONFIG } from '../config/constants';
import { StartProcessRequest, RequiredField } from '../models/types';
import { AutoLog } from '../utils/logger';

@AutoLog
export class CamundaService {
    private client: any;

    constructor() {
        this.client = api(CONFIG.CAMUNDA_BASE_URL);
    }
  
    /**
     * Starts a new Camunda process instance
     */
    async startProcess(request: StartProcessRequest): Promise<string> {
        const path = `/process-definition/key/${CONFIG.PROCESS_DEFINITION_KEY}/start`;

        const variables = {
            firstName: { value: request.firstName, type: 'String' },
            lastName: { value: request.lastName, type: 'String' },
            memberId: { value: request.memberId, type: 'String' },
            dateOfBirth: { value: request.dateOfBirth, type: 'Date' },
            dateJoinedFund: { value: request.dateJoinedFund, type: 'Date' },
            effectiveDate: { value: request.effectiveDate, type: 'Date' },
            calculationDate: { value: request.calculationDate, type: 'Date' },
            benefitClass: { value: request.benefitClass, type: 'String' },
            paymentType: { value: request.paymentType, type: 'String' },
            planNumber: { value: request.planNumber, type: 'String' },
            paymentTypeDesc: { value: request.paymentTypeDesc, type: 'String' }
        };

        try {
            const response = await this.client
                .header('Content-Type', 'application/json')
                .post(path)
                .body({ variables })
                .response();

            const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

            if (body && body.id) {
                return body.id;
            }

            throw new Error('Failed to get process instance ID from response');
        } catch (error: any) {
            throw new Error(`Failed to start process: ${error.message}`);
        }
    }

    /**
     * Retrieves the task ID for a given process instance
     */
    async getTaskId(processInstanceId: string): Promise<string> {
        const path = `/task?processInstanceId=${processInstanceId}`;

        try {
            const response = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

            if (Array.isArray(body) && body.length > 0) {
                return body[0].id;
            }

            throw new Error(`No tasks found for process instance: ${processInstanceId}`);
        } catch (error: any) {
            throw new Error(`Failed to get task ID: ${error.message}`);
        }
    }

    /**
     * Gets required fields for a task from form variables
     */
    async getRequiredFields(taskId: string,processInstanceId:string): Promise<RequiredField[]> {
        const path = `/task/${taskId}/form-variables`;

        try {
            const response = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

            if (body?.requiredFields?.value) {
                return JSON.parse(body.requiredFields.value);
            }
        } catch (error) {
            throw new Error(`Failed to get required fields for process ${processInstanceId} : ${error.message}`);
        }

        return [];
    }

    /**
     * Completes a task with provided variables
     */
    async completeTaskWithVariables(taskId: string, variables: Record<string, any>): Promise<void> {
        const path = `/task/${taskId}/complete`;

        const camundaVariables: Record<string, any> = {};

        // Convert variables to Camunda format with type inference
        for (const [key, value] of Object.entries(variables)) {
            if (typeof value === 'object' && value !== null && 'value' in value && 'type' in value) {
                camundaVariables[key] = value;
                continue;
            }

            let type = 'String';
            if (typeof value === 'number') type = 'Double';
            else if (typeof value === 'boolean') type = 'Boolean';
            else if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}.*/.test(value)) type = 'Date';

            camundaVariables[key] = { value, type };
        }


        try {
            await this.client
                .header('Content-Type', 'application/json')
                .post(path)
                .body({ variables: camundaVariables })
                .response();
        } catch (error: any) {
            throw new Error(`Failed to complete task: ${error.message}`);
        }
    }

    /**
     * Completes a task with raw request body
     */
    async completeTaskDirect(taskId: string, requestBody: any): Promise<void> {
        const path = `/task/${taskId}/complete`;

        try {
            await this.client
                .header('Content-Type', 'application/json')
                .post(path)
                .body(requestBody)
                .response();
        } catch (error: any) {
            throw new Error(`Failed to complete task: ${error.message}`);
        }
    }

    /**
     * Retrieves all variables for a process instance
     */
    async getProcessVariables(processInstanceId: string): Promise<Record<string, any>> {
        const path = `/variable-instance?processInstanceIdIn=${processInstanceId}`;

        try {
            const response = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

            const variables: Record<string, any> = {};
            for (const variable of body) {
                const name = variable.name;
                // Stringify objects, keep primitives as-is
                const value = typeof variable.value === 'object' && variable.value !== null
                    ? JSON.stringify(variable.value)
                    : variable.value;

                variables[name] = value;
            }

            return variables;
        } catch (error: any) {
            throw new Error(`Failed to get process variables: ${error.message}`);
        }
    }

    /**
     * Gets subprocess instance ID for a given super process
     */
    async getSubProcessInstanceId(superProcessInstanceId: string): Promise<string | null> {
        const path = `/process-instance?superProcessInstance=${superProcessInstanceId}`;

        try {
            const response = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

            if (Array.isArray(body) && body.length > 0) {
                return body[0].id;
            }

            return null;
        } catch (error: any) {
            return null;
        }
    }

    /**
     * Checks if a process instance has completed
     */
    async isProcessCompleted(processInstanceId: string): Promise<boolean> {
        const path = `/process-instance/${processInstanceId}`;

        try {
            const response = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
            return false;
        } catch (error: any) {
            // 404 means process is completed (no longer active)
            if (error.message.includes('404') || error.message.includes('Not Found')) {
                return true;
            }
            
            return await this.checkProcessInHistory(processInstanceId);
        }
    }

    /**
     * Checks process completion status in history
     */
    private async checkProcessInHistory(processInstanceId: string): Promise<boolean> {
        const path = `/history/process-instance/${processInstanceId}`;

        try {
            const response = await this.client
                .get(path)
                .response();

            const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

            // Process is completed if it has an end time
            return body && body.endTime !== null;
        } catch (error: any) {
            return false;
        }
    }
}