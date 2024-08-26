package se.omegapoint;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import se.omegapoint.helloworld.dto.HelloWorldResponse;


@Slf4j
public class HelloWorldHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final HelloService helloService;
    private final WorldService worldService;
    private final ObjectMapper mapper;

    public HelloWorldHandler() {
        this.helloService = new HelloService();
        this.worldService = new WorldService();
        this.mapper = new ObjectMapper();

        var hello = helloService.getHello();
        var world = worldService.getWorld();

        log.debug("Completed initialization: {}, {}!", hello, world);
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent apiGatewayProxyRequestEvent, Context context) {
        var hello = helloService.getHello();
        var world = worldService.getWorld();
        var message = "%s %s!".formatted(hello, world);

        var response = new HelloWorldResponse();
        response.setMessage(message);

        try {
            return new APIGatewayProxyResponseEvent().withStatusCode(200).withBody(mapper.writeValueAsString(response));
        } catch (JsonProcessingException e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500);
        }
    }
}
